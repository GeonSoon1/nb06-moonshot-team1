import express from 'express';
import subTaskControl from '../controllers/subtask.control.js'; // .js 필수
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const subtaskRouter = express.Router();

//목록상세조회
subtaskRouter.get('/:subTaskId', authenticate, authorize.projectMember, asyncHandler(subTaskControl.getSubTask));
// 수정
subtaskRouter.patch('/:subTaskId', authenticate, authorize.projectMember, asyncHandler(subTaskControl.updateSubTask));

// 삭제
subtaskRouter.delete('/:subTaskId', authenticate, authorize.projectMember, asyncHandler(subTaskControl.deleteSubTask));

export default subtaskRouter;
