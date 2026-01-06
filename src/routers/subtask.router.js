import express from 'express';
import subTaskControl from '../controllers/subtask.control.js'; // .js 필수
import { asyncHandler } from '../middlewares/asyncHandler.js';

const subtaskRouter = express.Router();

//목록상세조회
subtaskRouter.get('/:subTaskId', asyncHandler(subTaskControl.getSubTask));
// 수정
subtaskRouter.patch('/:subTaskId', asyncHandler(subTaskControl.updateSubTask));

// 삭제
subtaskRouter.delete('/:subTaskId', asyncHandler(subTaskControl.deleteSubTask));

export default subtaskRouter;
