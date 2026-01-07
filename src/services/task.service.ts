import * as taskRepo from '../repositories/task.repo';
import fs from 'fs';
import path from 'path';
import { formatTask } from '../lib/util';
import { NotFoundError, ForbiddenError } from '../middlewares/errors/customError';
import { FormattedTask, TaskInput, TaskListResponse, TaskQueryInput } from '../dto/task';
import { Prisma, TaskStatus } from '@prisma/client';

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

  const validAttachments =
    attachments?.filter((url) => {
      // URL에서 파일명만 추출 (예: winter-123.jpg)
      const fileName = url.split('/').pop() || '';
      // 실제 저장 경로 생성
      const filePath = path.join(process.cwd(), 'uploads', fileName);
      // 파일이 존재할 때만 true 반환
      return fs.existsSync(filePath);
    }) || [];

  const data = {
    title,
    description: description || null,
    status: status?.toUpperCase() || 'TODO',

    startDate: new Date(Number(startYear), Number(startMonth) - 1, Number(startDay)),
    endDate: new Date(Number(endYear), Number(endMonth) - 1, Number(endDay)),
    projectId: Number(projectId),
    taskCreatorId: userId,
    assigneeProjectMemberId: userId,

    taskTags: {
      create: tags?.map((name) => ({
        tag: { connectOrCreate: { where: { name }, create: { name } } }
      }))
    },
    attachments: {
      create: validAttachments.map((url) => ({ url })) || []
    }
  };

  return formatTask(await taskRepo.createTask(data));
};

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

export const getTaskDetail = async (id: number): Promise<FormattedTask> => {
  const task = await taskRepo.findById(id);
  if (!task) throw new NotFoundError();
  return formatTask(task);
};

export const updateTaskInfo = async (
  id: number,
  body: TaskInput,
  userId: number
): Promise<FormattedTask> => {
  const task = await taskRepo.findById(id);
  if (!task) throw new NotFoundError();

  const {
    title,
    description,
    status,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
    assigneeId,
    tags,
    attachments
  } = body;

  const requester = await taskRepo.findProjectMember(task.projectId, userId);
  if (!requester) throw new ForbiddenError('프로젝트 멤버가 아닙니다');

  // 담당자 변경 시 검증 (assigneeId가 있을 때만)
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
      connect: {
        projectId_memberId: {
          projectId: task.projectId,
          memberId: Number(assigneeId)
        }
      }
    };
  }

  // DB 트랜잭션
  const updated = await taskRepo.updateWithTransaction(id, updateData, tags, attachments);

  return formatTask(updated);
};

// 할 일 삭제
export const deleteTask = async (id: number) => await taskRepo.remove(id);

// // 하위 할 일 생성
// export async function createSubTask(subTaskData) {
//   const subtask = await taskRepo.createSubTask(subTaskData);
//   const { id, title, taskId, status, createdAt, updatedAt } = subtask;
//   return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
// }

// 하위 할 일 목록 조회
export async function getSubTasks(taskId: number) {
  const subTasks = await taskRepo.findSubTasksByTaskId(taskId);
  const newSubTasks = subTasks.map((s) => {
    const { id, title, taskId, status, createdAt, updatedAt } = s;
    return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
  });
  return newSubTasks;
}
