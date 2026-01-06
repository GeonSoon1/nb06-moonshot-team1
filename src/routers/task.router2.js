import express from 'express';
import taskControl2 from '../controllers/task.control2.js'; // .js 필수
import { asyncHandler } from '../middlewares/asyncHandler.js';

const taskRouter2 = express.Router();

// 생성
taskRouter2.post('/:taskId/subtasks', asyncHandler(taskControl2.createSubTask));

// 목록 조회
taskRouter2.get('/:taskId/subtasks', asyncHandler(taskControl2.getSubTasks));

export default taskRouter2;
