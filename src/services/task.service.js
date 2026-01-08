import * as taskRepo from '../repositories/task.repo.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middlewares/errors/customError.js';
import { formatTask } from '../lib/utils/util.js';
import { oAuthRepo } from '../repositories/oAuth.repo.js';
import { getCalendarClient, syncCalendarEvent, taskToEvent } from '../lib/utils/calendar.js';
import { createCalendarEvent, deleteCalendarEvent } from '../repositories/calendar.repo.js';

export const createNewTask = async (projectId, userId, body, filePaths) => {
  // 데이터 형식이 숫자가 아니면 400 에러
  if (isNaN(body.startYear)) throw new BadRequestError('잘못된 요청 형식');
  const data = {
    title: body.title,
    description: body.description,
    status: body.status?.toUpperCase() || 'TODO',
    // 프론트엔드에서 받은 날짜 데이터를 데이터베이스가 이해할 수 있는 표준 Date 객체로 변환하여 저장
    startDate: new Date(body.startYear, body.startMonth - 1, body.startDay),
    endDate: new Date(body.endYear, body.endMonth - 1, body.endDay),
    projectId,
    taskCreatorId: userId,
    assigneeProjectMemberId: userId,
    taskTags: {
      create: body.tags?.map((name) => ({
        tag: {
          connectOrCreate: { where: { name }, create: { name } }
        }
      }))
    },
    attachments: { create: filePaths.map((url) => ({ url })) }
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

export const updateTaskInfo = async (id, body, userId, newFilePaths) => {
  // 1. 먼저 기존 할 일을 조회해서 어떤 프로젝트에 속해 있는지 알아내기
  const task = await taskRepo.findById(id);
  if (!task) {
    throw new NotFoundError();
  }

  // userId를 사용하여 "수정하려는 나"가 멤버인지 서비스에서도 한 번 더 확인!
  const requester = await taskRepo.findProjectMember(task.projectId, userId);
  if (!requester) {
    throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  }

  // 2. 담당자를 바꾸려고 할때(assigneeId가 있을 때)만 검사 실행
  // 이 프로젝트id를 가지고 assigneeId가 projectMember인지 알아보기
  if (body.assigneeId) {
    const targetAssigneeId = Number(body.assigneeId);

    // repo에서 데이터를 가져온다.(찾으면 객체, 못 찾으면 null)
    const member = await taskRepo.findProjectMember(task.projectId, targetAssigneeId);

    if (!member) {
      // console.log('담당자 후보가 프로젝트 멤버가 아닙니다.')
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }
  }

  const updateData = {};
  if (body.title) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.status) updateData.status = body.status.toUpperCase();
  if (body.startYear) updateData.startDate = new Date(body.startYear, body.startMonth - 1, body.startDay);
  if (body.endYear) updateData.endDate = new Date(body.endYear, body.endMonth - 1, body.endDay);
  if (body.assigneeId) updateData.assigneeProjectMemberId = Number(body.assigneeId);

  //민수 추가
  let updatedTask = await taskRepo.updateWithTransaction(id, updateData, body.tags, newFilePaths);
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
