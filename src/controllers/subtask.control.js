import { assert } from 'superstruct';
import subTaskService from '../services/subtask.service.js'; // .js 필수
import { PatchSubTask } from '../structs/subTask.struct.js';

async function getSubTask(req, res, next) {
  const { subTaskId } = req.params;
  const subTask = await subTaskService.getSubTask(Number(subTaskId));

  res.status(200).json(subTask);
}

// 3. 수정
async function updateSubTask(req, res, next) {
  const { subTaskId } = req.params;
  const { title, status } = req.body;

  const subtaskData = {
    title: title ?? undefined,
    status: status ?? undefined
  };
  assert(subtaskData, PatchSubTask);
  const updatedSubTask = await subTaskService.updateSubTask(Number(subTaskId), subtaskData);

  res.status(200).json(updatedSubTask);
}

// 4. 삭제
async function deleteSubTask(req, res, next) {
  const { subTaskId } = req.params;
  await subTaskService.deleteSubTask(Number(subTaskId));

  res.status(204).json(null);
}

export default {
  getSubTask,
  updateSubTask,
  deleteSubTask
};
