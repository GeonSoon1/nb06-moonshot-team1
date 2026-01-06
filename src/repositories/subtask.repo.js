import { prisma } from '../lib/prismaClient.js'; // 본인 환경에 맞게 유지

// 2. 하위 할 일 목록 조회 (특정 Task에 속한 것들)
async function findSubTasksByTaskId(id) {
  return await prisma.subTask.findUnique({ where: { id } });
}

// 3. 하위 할 일 단건 조회 (수정/삭제 전 확인용)
async function findSubTaskById(id) {
  return await prisma.subTask.findUnique({
    where: { id }
  });
}

// 4. 하위 할 일 수정
async function updateSubTask(id, data) {
  return await prisma.subTask.update({
    where: { id },
    data
  });
}

// 5. 하위 할 일 삭제
async function deleteSubTask(id) {
  return await prisma.subTask.delete({
    where: { id }
  });
}

// [중요] 이렇게 내보내야 Service에서 subTaskRepo.createSubTask 처럼 씁니다.
export default {
  findSubTasksByTaskId,
  findSubTaskById,
  updateSubTask,
  deleteSubTask
};
