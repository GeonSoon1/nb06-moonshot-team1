import { prisma } from '../lib/prismaClient.js';


export const createTask = async (data) => {
  const task = await prisma.task.create({
    data,
    include: {
      assigneeProjectMember: { include: { member: true } },
      taskTags: { include: { tag: true } },
      attachments: true
    }
  });
  return task;
};

export const findMany = (where, skip, take, orderBy) =>
  prisma.task.findMany({
    where,
    skip,
    take,
    orderBy,
    include: { assigneeProjectMember: { include: { member: true } }, taskTags: { include: { tag: true } }, attachments: true }
  });

export const count = (where) => prisma.task.count({ where });

export const findById = (id) =>
  prisma.task.findUnique({
    where: { id },
    include: { assigneeProjectMember: { include: { member: true } }, taskTags: { include: { tag: true } }, attachments: true }
  });

export const updateWithTransaction = async (id, data, tags, attachments) => {
  const updated = prisma.$transaction(async (tx) => {
    if (tags) await tx.taskTag.deleteMany({ where: { taskId: id } });
    // 삭제 후, 새로 받은 tags를 data 객체에 'create'로 넣어줍니다.
    data.taskTags = {
      create: tags.map((name) => ({
        tag: { connectOrCreate: { where: { name }, create: { name } } }
      }))
    };

    if (attachments) await tx.attachment.deleteMany({ where: { taskId: id } });
    // 새로 받은 파일 경로들을 data 객체에 'create'로 넣어줍니다.
    data.attachments = {
      create: attachments.map((url) => ({ url }))
    };

    return await tx.task.update({
      where: { id },
      data,
      include: { assigneeProjectMember: { include: { member: true } }, taskTags: { include: { tag: true } }, attachments: true }
    });
  });
  return updated;
};

// projectMember인지 확인하는 부분
export const findProjectMember = async (projectId, memberId) => {
  return await prisma.projectMember.findUnique({
    where: { projectId_memberId: { projectId, memberId } }
  });
};

export const remove = (id) => prisma.task.delete({ where: { id } });

// 하위 할 일 생성
export async function createSubTask(data) {
  return await prisma.subTask.create({
    data
  });
}

// 하위 할 일 목록 조회 (특정 Task에 속한 것들)
export async function findSubTasksByTaskId(taskId) {
  return await prisma.subTask.findMany({
    where: {
      taskId
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}
