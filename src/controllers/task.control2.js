import { assert } from 'superstruct';
import taskService2 from '../services/task.service2.js'; // .js 필수
import { CreateSubTask } from '../structs/subTask.struct.js';

// 1. 생성
async function createSubTask(req, res, next) {
  const { taskId } = req.params;
  const { title } = req.body;
  const subTaskData = { taskId: Number(taskId), title, status: 'TODO' };
  assert(subTaskData, CreateSubTask);
  const newSubTask = await taskService2.createSubTask(subTaskData);

  res.status(201).json(newSubTask);
}

// 2. 조회 (Query String으로 taskId를 받는다고 가정: /api/subtasks?taskId=1)
async function getSubTasks(req, res, next) {
  const { taskId } = req.params;
  const subTasks = await taskService2.getSubTasks(Number(taskId));

  res.status(200).json(subTasks);
}

export default {
  createSubTask,
  getSubTasks
};
