import taskRepo2 from '../repositories/task.repo2.js'; // .js 필수
import AppError from '../structs/appError.js'; // .js 필수

// 1. 생성
// async function createSubTask(subTaskData) {
//   return await taskRepo2.createSubTask(subTaskData);
// }

async function createSubTask(subTaskData) {
  const subtask = await taskRepo2.createSubTask(subTaskData);
  const { id, title, taskId, status, createdAt, updatedAt } = subtask;
  return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
}
// 2. 하위할일 목록 조회
async function getSubTasks(taskId) {
  const subTasks = await taskRepo2.findSubTasksByTaskId(taskId);
  const newSubTasks = subTasks.map((s) => {
    const { id, title, taskId, status, createdAt, updatedAt } = s;
    return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
  });
  return newSubTasks;
}
export default {
  createSubTask,
  getSubTasks
};
