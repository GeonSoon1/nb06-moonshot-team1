import { Prisma, ProjectMember, SubTask, Comment } from '@prisma/client';
import { TaskDelete, TaskWithDetails, taskInclude } from '../types/task';
import { prisma } from '../lib/prismaClient';

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

// 목록 조회에서 total 쓸 때 사용.
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
    if (Array.isArray(tags)) {
      await tx.taskTag.deleteMany({ where: { taskId: id } });

      if (tags.length > 0) {
        data.taskTags = {
          create: tags.map((name) => ({
            tag: { connectOrCreate: { where: { name }, create: { name } } }
          }))
        };
      }
    }

    if (Array.isArray(attachments)) {
      await tx.attachment.deleteMany({ where: { taskId: id } });

      if (attachments.length > 0) {
        data.attachments = {
          create: attachments.map((url) => ({ url }))
        };
      }
    }

    return (await tx.task.update({
      where: { id },
      data,
      include: taskInclude
    })) as TaskWithDetails;
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

export async function createComment(data: Prisma.CommentCreateManyInput): Promise<Comment> {
  return prisma.comment.create({ data });
}

export async function findAllByTaskId(taskId: number, skip: number, limit: number) {
  const [data, total] = await Promise.all([
    prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
          include: { member: true }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.comment.count({ where: { taskId } })
  ]);
  return { data, total };
}
