import { any, assert, string } from 'superstruct';
import subTaskService from '../services/subtask.service'; // .js 필수
import { PatchSubTask } from '../structs/subtask.struct';
import { Request, Response, NextFunction } from 'express';

async function getSubTask(req: Request, res: Response, next: NextFunction) {
  const { subTaskId } = req.params;
  const subTask = await subTaskService.getSubTask(Number(subTaskId));

  res.status(200).json(subTask);
}

// 3. 수정
async function updateSubTask(req: Request, res: Response, next: NextFunction) {
  const { subTaskId } = req.params;
  const { title, status } = req.body;

  const subtaskData = {
    title: title ?? undefined,
    status: status ?? undefined
  };
  assert(subtaskData, PatchSubTask);
  const updatedSubTask = await subTaskService.updateSubTask(Number(subTaskId), subtaskData as any);

  res.status(200).json(updatedSubTask);
}

// 4. 삭제
async function deleteSubTask(req: Request, res: Response, next: NextFunction) {
  const { subTaskId } = req.params;
  await subTaskService.deleteSubTask(Number(subTaskId));

  res.status(204).json(null);
}

export default {
  getSubTask,
  updateSubTask,
  deleteSubTask
};
