import * as taskRepo from '../repositories/task.repo.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middlewares/errors/customError.js';
import { formatTask } from '../lib/utils/util.js';
import { oAuthRepo } from '../repositories/oAuth.repo.js';
import { getCalendarClient, syncCalendarEvent, taskToEvent } from '../lib/utils/calendar.js';
import { createCalendarEvent, deleteCalendarEvent } from '../repositories/calendar.repo.js';
import { number } from 'superstruct';

export const createNewTask = async (projectId, userId, body) => {

  const { title, description, startYear, startMonth, startDay, 
    endYear, endMonth, endDay, status, tags, attachments } = body;
  // 데이터 형식이 숫자가 아니면 400 에러
  if (isNaN(startYear)) throw new BadRequestError('잘못된 요청 형식');
  const data = {
    title: title,
    description: description,
    status: status?.toUpperCase() || 'TODO',
    // 프론트엔드에서 받은 날짜 데이터를 데이터베이스가 이해할 수 있는 표준 Date 객체로 변환하여 저장
    startDate: new Date(Number(startYear), Number(startMonth)- 1, Number(startDay)),
    endDate: new Date(Number(endYear), Number(endMonth) - 1, Number(endDay)),
    projectId: number(projectId),
    taskCreatorId: userId,
    assigneeProjectMemberId: userId,
    taskTags: {
      create: tags?.map((name) => ({
        tag: {
          connectOrCreate: { where: { name }, create: { name } }
        }
      }))
    },
    attachments: { create: attachments?.map((url) => ({ url })) || []
    }
  };
  // 1) 민수 추가 - Task 먼저 생성
  const createdTask = await taskRepo.createTask(data);
  // 2) 구글 연동 여부 확인 (연동 안돼있으면 그냥 리턴)
  const googleAccount = await oAuthRepo.findGoogleToken(userId);
  if (!googleAccount?.refreshTokenEnc) {
    return formatTask(createdTask);
  }
  // 3) 연동돼 있으면 캘린더 이벤트 생성 시도 (실패해도 Task는 성공)
  try {
    const calendar = await getCalendarClient(userId);
    const event = taskToEvent(createdTask);
    const resp = await createCalendarEvent(calendar, {
      calendarId: 'primary',
      event
    });
    const googleEventId = resp?.data?.id;
    if (googleEventId) {
      const updatedTask = await taskRepo.setGoogleEventId(createdTask.id, googleEventId);
      return formatTask(updatedTask);
    }
    return formatTask(createdTask);
  } catch (err) {
    console.warn('calendar sync failed', { err: String(err), taskId: createdTask.id, userId });
    return formatTask(createdTask);
  }
};

export const getTaskList = async (projectId, query) => {
  const { page = 1, limit = 10, status, assignee, keyword, order = 'desc', order_by = 'created_at' } = query;
  const where = {
    projectId,
    ...(status && { status: status.toUpperCase() }),
    ...(assignee && { assigneeProjectMemberId: Number(assignee) }),
    ...(keyword && { title: { contains: keyword, mode: 'insensitive' } })
  };
  const orderBy = {
    created_at: { createdAt: order },
    name: { title: order },
    end_date: { endDate: order }
  }[order_by] || { createdAt: 'desc' };

  const [tasks, total] = await Promise.all([
    taskRepo.findMany(where, (Number(page) - 1) * Number(limit), Number(limit), orderBy),
    taskRepo.count(where)
  ]);
  return { data: tasks.map((t) => formatTask(t)), total };
};

export const getTaskDetail = async (id) => {
  const task = await taskRepo.findById(id);
  if (!task) throw new NotFoundError();
  return formatTask(task);
};

export const updateTaskInfo = async (id, body, userId) => {
  // 1. 기존 할 일 조회
  const task = await taskRepo.findById(id);
  if (!task) {
    throw new NotFoundError();
  }
  
  // (attachments 포함)
  const { 
    title, description, status, 
    startYear, startMonth, startDay, 
    endYear, endMonth, endDay, 
    assigneeId, tags, attachments 
  } = body;
  
  // 2. 권한 확인 
  const requester = await taskRepo.findProjectMember(task.projectId, userId);
  if (!requester) throw new ForbiddenError('프로젝트 멤버가 아닙니다');

  // 3. 담당자 변경 시 검증
  if (assigneeId) {
    const member = await taskRepo.findProjectMember(task.projectId, Number(assigneeId));
    if (!member) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  }

  // 4. 업데이트 데이터 조립 (Prisma.TaskUpdateInput 형식)
  const updateData = {};
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status) updateData.status = status.toUpperCase();
  
  if (startYear && startMonth && startDay) {
    updateData.startDate = new Date(Number(startYear), Number(startMonth) - 1, Number(startDay));
  }
  if (endYear && endMonth && endDay) {
    updateData.endDate = new Date(Number(endYear), Number(endMonth) - 1, Number(endDay));
  }
  if (assigneeId) {
    updateData.assigneeProjectMember = {
      connect: { projectId_memberId: { projectId: task.projectId, memberId: Number(assigneeId) } }
    };
  }
  //민수 추가
  let updatedTask = await taskRepo.updateWithTransaction(id, updateData, tags, attachments);
  // 6) 캘린더 동기화 (비차단 방식)
  const syncUserId = task.taskCreatorId;
  const googleAccount = await oAuthRepo.findGoogleToken(syncUserId);
  if (googleAccount?.refreshTokenEnc) {
    // 비동기로 날림 처리 → 실패해도 전체 흐름엔 영향 없음
    syncCalendarEvent(updatedTask, syncUserId).catch((err) =>
      console.warn('calendar sync failed (update)', {
        err: String(err),
        taskId: updatedTask.id,
        userId: syncUserId,
        googleEventId: updatedTask.googleEventId ?? null
      })
    );
  }

  return formatTask(updatedTask);
};

export async function deleteTask(id, userId) {
  // 1) 삭제에 필요한 최소 정보 조회
  const task = await taskRepo.findDeleteMetaById(id);
  if (!task) throw new NotFoundError();
  // 2) 권한(프로젝트 멤버) 체크
  const requester = await taskRepo.findProjectMember(task.projectId, userId);
  if (!requester) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  // 3) DB 삭제 먼저
  await taskRepo.remove(id);
  // 4) 캘린더 이벤트 삭제
  const syncUserId = task.taskCreatorId;
  if (task.googleEventId) {
    (async () => {
      const googleAccount = await oAuthRepo.findGoogleToken(syncUserId);
      if (!googleAccount?.refreshTokenEnc) return;
      const calendar = await getCalendarClient(syncUserId);
      await deleteCalendarEvent(calendar, {
        calendarId: 'primary',
        eventId: task.googleEventId
      });
    })().catch((err) => {
      console.warn('calendar sync failed (delete)', {
        err: String(err),
        taskId: task.id,
        userId: syncUserId,
        googleEventId: task.googleEventId
      });
    });
  }
}

// 하위 할 일 생성
export async function createSubTask(subTaskData) {
  const subtask = await taskRepo.createSubTask(subTaskData);
  const { id, title, taskId, status, createdAt, updatedAt } = subtask;
  return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
}

// 하위 할 일 목록 조회
export async function getSubTasks(taskId) {
  const subTasks = await taskRepo.findSubTasksByTaskId(taskId);
  const newSubTasks = subTasks.map((s) => {
    const { id, title, taskId, status, createdAt, updatedAt } = s;
    return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
  });
  return newSubTasks;
}
