import { Prisma, SubTask } from '@prisma/client';
import subTaskRepo from '../repositories/subtask.repo'; // .js 필수

// 하위할일 상세조회
async function getSubTask(subTaskId: number) {
  const subTask = (await subTaskRepo.findSubTaskById(subTaskId)) as SubTask;
  // if (!subTask) return null;//수정
  const { id, title, taskId, status, createdAt, updatedAt } = subTask;
  return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
}

// 3. 수정
async function updateSubTask(subTaskId: number, subtaskData: Prisma.SubTaskUpdateInput) {
  const subTask = await subTaskRepo.updateSubTask(subTaskId, subtaskData);
  const { id, title, taskId, status, createdAt, updatedAt } = subTask;
  return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
}

// 4. 삭제
async function deleteSubTask(subTaskId: number) {
  return await subTaskRepo.deleteSubTask(subTaskId);
}

export default {
  getSubTask,
  updateSubTask,
  deleteSubTask
};
