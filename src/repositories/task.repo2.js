import { prisma } from '../lib/prismaClient.js'; // 본인 환경에 맞게 유지

// 1. 하위 할 일 생성
async function createSubTask(data) {
  return await prisma.subTask.create({
    data
  });
}

// 2. 하위 할 일 목록 조회 (특정 Task에 속한 것들)
async function findSubTasksByTaskId(taskId) {
  return await prisma.subTask.findMany({
    where: {
      taskId
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}
export default {
  createSubTask,
  findSubTasksByTaskId
};
