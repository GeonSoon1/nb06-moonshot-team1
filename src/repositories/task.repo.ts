import { Prisma, ProjectMember, SubTask } from '@prisma/client';
import { TaskDelete, TaskWithDetails, taskInclude } from '../types/task';
import { prisma } from '../lib/prismaClient.js';

export const createTask = async (data: Prisma.TaskUncheckedCreateInput): Promise<TaskWithDetails> => {
  const task = await prisma.task.create({
    data,
    include: taskInclude
  });

  return task as TaskWithDetails;
};

export const findMany = async (
  where: Prisma.TaskWhereInput,
  skip: number,
  take: number,
  orderBy: Prisma.TaskOrderByWithRelationInput
): Promise<TaskWithDetails[]> => {
  return await prisma.task.findMany({
    where,
    skip,
    take,
    orderBy,
    include: taskInclude
  });
};

export const count = async (where: Prisma.TaskWhereInput): Promise<number> => {
  const totalCount = await prisma.task.count({ where });
  return totalCount;
};

export const findById = async (id: number): Promise<TaskWithDetails | null> => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: taskInclude
  });

  return task as TaskWithDetails | null;
};

export const updateWithTransaction = async (
  id: number,
  data: Prisma.TaskUpdateInput,
  tags?: string[],
  attachments?: string[]
): Promise<TaskWithDetails> => {
  return await prisma.$transaction(async (tx) => {
    // 태그 수정 로직
    if (tags) {
      await tx.taskTag.deleteMany({ where: { taskId: id } });
      data.taskTags = {
        create: tags.map((name) => ({
          tag: { connectOrCreate: { where: { name }, create: { name } } }
        }))
      };
    }

    // 첨부파일 수정 로직
    if (attachments) {
      await tx.attachment.deleteMany({ where: { taskId: id } });
      data.attachments = {
        create: attachments.map((url) => ({ url }))
      };
    }

    // 최종 업데이트 실행
    const updated = await tx.task.update({
      where: { id },
      data,
      include: taskInclude
    });
    return updated as TaskWithDetails;
  });
};

// projectMember인지 확인하는 부분
export const findProjectMember = async (projectId: number, memberId: number): Promise<ProjectMember | null> => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_memberId: { projectId, memberId } }
  });
  return member;
};

export const remove = async (id: number): Promise<void> => {
  await prisma.task.delete({ where: { id } });
};

// 하위 할 일 생성
export async function createSubTask(data: Prisma.SubTaskUncheckedCreateInput): Promise<SubTask> {
  return await prisma.subTask.create({
    data
  });
}

// 하위 할 일 목록 조회 (특정 Task에 속한 것들)
export async function findSubTasksByTaskId(taskId: number): Promise<SubTask[]> {
  return await prisma.subTask.findMany({
    where: {
      taskId
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}

//민수 추가(캘린더)
export const setGoogleEventId = (taskId: number, googleEventId: string): Promise<TaskWithDetails> =>
  prisma.task.update({
    where: { id: taskId },
    data: { googleEventId },
    include: {
      assigneeProjectMember: { include: { member: true } },
      taskTags: { include: { tag: true } },
      attachments: true
    }
  });
//기존 findbyid가 인클루드가 커서 삭제용으로 가볍게 만들었습니다.
export const findDeleteMetaById = (id: number): Promise<TaskDelete | null> =>
  prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      projectId: true,
      taskCreatorId: true,
      googleEventId: true
    }
  });
