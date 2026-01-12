import * as taskRepo from '../repositories/task.repo';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middlewares/errors/customError';
import { formatTask } from '../lib/utils/util';
import { oAuthRepo } from '../repositories/oAuth.repo';
import { getCalendarClient, syncCalendarEvent, taskToEvent } from '../lib/utils/calendar';
import { createCalendarEvent, deleteCalendarEvent } from '../repositories/calendar.repo';
import { Prisma, TaskStatus } from '@prisma/client';
import { TaskInput, TaskQueryInput } from '../types/task';
import { FormattedTask, TaskListResponse } from '../dto/taskResponseDTO';
import { TaskWithDetails } from '../types/task';
import { CreateSubTaskInput } from '../types/subtask';
import { FormattedSubTask } from '../dto/subTaskResponseDTO';
import { formatComment } from '../lib/utils/util';

// 생성
export const createNewTask = async (
  projectId: number,
  userId: number,
  body: TaskInput
): Promise<FormattedTask> => {
  const {
    title,
    description,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
    status,
    tags,
    attachments
  } = body;

  if (isNaN(Number(startYear))) {
    throw new BadRequestError('잘못된 요청 형식');
  }
  const data = {
    title: title,
    description: description,
    status: (status?.toUpperCase() as TaskStatus) || 'TODO',

    startDate: new Date(Number(startYear), Number(startMonth) - 1, Number(startDay)),
    endDate: new Date(Number(endYear), Number(endMonth) - 1, Number(endDay)),

    projectId: projectId, //controller에서 Number()처리 했는지 확인해야함.
    taskCreatorId: userId,
    assigneeProjectMemberId: userId,
    taskTags: {
      create: tags?.map((name) => ({
        tag: {
          connectOrCreate: { where: { name }, create: { name } }
        }
      }))
    },
    attachments: { create: attachments?.map((url) => ({ url })) || [] }
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

// 조회
export const getTaskList = async (
  projectId: number,
  query: TaskQueryInput
): Promise<TaskListResponse> => {
  const {
    page = 1,
    limit = 10,
    status,
    assignee,
    keyword,
    order = 'desc',
    order_by = 'created_at'
  } = query;

  const where: Prisma.TaskWhereInput = {
    projectId,
    ...(status && { status: status.toUpperCase() as TaskStatus }),
    ...(assignee && { assigneeProjectMemberId: Number(assignee) }),
    ...(keyword && { title: { contains: keyword, mode: 'insensitive' as const } })
  };

  // 정렬 조건
  const orderBy: Prisma.TaskOrderByWithRelationInput = {};
  if (order_by === 'created_at') orderBy.createdAt = order;
  else if (order_by === 'name') orderBy.title = order;
  else if (order_by === 'end_date') orderBy.endDate = order;

  const tasks = await taskRepo.findMany(
    where, 
    (Number(page) - 1) * Number(limit), 
    Number(limit), 
    orderBy
  );

  return { 
    data: tasks.map((t) => formatTask(t)), 
    total: tasks.length 
  };
};

// 상세 조회
export const getTaskDetail = async (id: number): Promise<FormattedTask> => {
  const task = await taskRepo.findById(id);

  if (!task) {
    throw new NotFoundError();
  }
  return formatTask(task);
};

// 수정
export const updateTaskInfo = async (
  id: number,
  body: TaskInput,
  userId: number
): Promise<FormattedTask> => {
  const task = await taskRepo.findById(id);
  if (!task) throw new NotFoundError();

  const { title, description, status, startYear, startMonth, startDay, endYear, endMonth, endDay, assigneeId, tags, attachments } = body;

  // 권한 확인
  const requester = await taskRepo.findProjectMember(task.projectId, userId);
  if (!requester) throw new ForbiddenError('프로젝트 멤버가 아닙니다');

  if (assigneeId) {
    const member = await taskRepo.findProjectMember(task.projectId, Number(assigneeId));
    if (!member) throw new ForbiddenError('프로젝트 멤버가 아닙니다');
  }

  const updateData: Prisma.TaskUpdateInput = {};
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (status) updateData.status = status.toUpperCase() as TaskStatus;

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

  let updatedTask = await taskRepo.updateWithTransaction(id, updateData, tags, attachments);

  // 캘린더 동기화
  const syncUserId = task.taskCreatorId;
  const googleAccount = await oAuthRepo.findGoogleToken(syncUserId);
  if (googleAccount?.refreshTokenEnc) {
    syncCalendarEvent(updatedTask, syncUserId).catch((err: any) =>
      console.warn('Calendar sync failed (update)', { err: String(err), taskId: updatedTask.id })
    );
  }

  return formatTask(updatedTask);
};


// 삭제
export async function deleteTask(id: number, userId: number): Promise<void> {
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
  const eventId = task.googleEventId ?? undefined;
  if (eventId) {
    (async () => {
      const googleAccount = await oAuthRepo.findGoogleToken(syncUserId);
      if (!googleAccount?.refreshTokenEnc) return;
      const calendar = await getCalendarClient(syncUserId);
      await deleteCalendarEvent(calendar, {
        calendarId: 'primary',
        eventId
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
export async function createSubTask(subTaskData: CreateSubTaskInput): Promise<FormattedSubTask> {
  const subtask = await taskRepo.createSubTask({
    ...subTaskData,
    status: subTaskData.status as TaskStatus
  });

  const { id, title, taskId, status, createdAt, updatedAt } = subtask;
  return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
}

// 하위 할 일 목록 조회
export async function getSubTasks(taskId: number): Promise<FormattedSubTask[]> {
  const subTasks = await taskRepo.findSubTasksByTaskId(taskId);

  const newSubTasks = subTasks.map((s) => {
    const { id, title, taskId, status, createdAt, updatedAt } = s;
    return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
  });
  return newSubTasks;
}

// 댓글 생성 (내용 검증 유지)
export async function createComment(commentData: Prisma.CommentCreateManyInput) {
  return await taskRepo.createComment(commentData);
}

// 특정 테스크의 댓글  목록 조회
export async function findAllByTaskId(taskId: number, userId: number, page: number, limit: number) {
  const skip = (Number(page) - 1) * Number(limit); // skip 계산 추가
  const comments = await taskRepo.findAllByTaskId(taskId, skip, limit);
  const formattedData = comments.map((c) => formatComment(c));
  return { formattedData, total: formattedData.length };
}
