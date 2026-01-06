import subTaskRepo from '../repositories/subtask.repo.js'; // .js 필수
import AppError from '../structs/appError.js'; // .js 필수

// 하위할일 상세조회
async function getSubTask(subTaskId) {
  const subTask = await subTaskRepo.findSubTaskById(subTaskId);
  const { id, title, taskId, status, createdAt, updatedAt } = subTask;
  return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
}

// 3. 수정
async function updateSubTask(subTaskId, subtaskData) {
  const subTask = await subTaskRepo.updateSubTask(subTaskId, subtaskData);
  const { id, title, taskId, status, createdAt, updatedAt } = subTask;
  return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
}

// 4. 삭제
async function deleteSubTask(subTaskId) {
  return await subTaskRepo.deleteSubTask(subTaskId);
}

export default {
  getSubTask,
  updateSubTask,
  deleteSubTask
};
