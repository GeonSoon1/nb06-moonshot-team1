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
    include: {
      assigneeProjectMember: { include: { member: true } },
      taskTags: { include: { tag: true } },
      attachments: true
    }
  });

export const count = (where) => prisma.task.count({ where });

export const findById = (id) =>
  prisma.task.findUnique({
    where: { id },
    include: {
      assigneeProjectMember: { include: { member: true } },
      taskTags: { include: { tag: true } },
      attachments: true
    }
  });
//민수 수정 태그가 언디파인드인데 매핑해버리는 경우가 생겨 가드 세움
export const updateWithTransaction = async (id, data, tags, attachmentUrls) => {
  return prisma.$transaction(async (tx) => {
    // tags: undefined => 변경 안 함
    // tags: [] => 전부 삭제
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

    // attachments도 동일 규칙
    // attachmentUrls: undefined => 변경 안 함
    // attachmentUrls: [] => 전부 삭제
    if (Array.isArray(attachmentUrls)) {
      await tx.attachment.deleteMany({ where: { taskId: id } });
      if (attachmentUrls.length > 0) {
        data.attachments = {
          create: attachmentUrls.map((url) => ({ url }))
        };
      }
    }

    return tx.task.update({
      where: { id },
      data,
      include: {
        assigneeProjectMember: { include: { member: true } },
        taskTags: { include: { tag: true } },
        attachments: true
      }
    });
  });
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
//민수 추가(캘린더)
export const setGoogleEventId = (taskId, googleEventId) =>
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
export const findDeleteMetaById = (id) =>
  prisma.task.findUnique({
    where: { id },
    select: {
      id: true,
      projectId: true,
      taskCreatorId: true,
      googleEventId: true
    }
  });
