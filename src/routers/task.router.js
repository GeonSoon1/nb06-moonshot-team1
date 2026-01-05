import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import * as taskControl from '../controllers/task.control.js';
import { upload } from '../middlewares/upload.js';


const taskRouter = express.Router();

// 프로젝트에 할 일 생성
taskRouter.post('/projects/:projectId/tasks', authenticate, authorize.projectMember, upload.array('files'), asyncHandler(taskControl.create));

// 프로젝트의 할 일 목록 조회
taskRouter.get('/projects/:projectId/tasks', authenticate, authorize.projectMember, asyncHandler(taskControl.getList));

// 할 일 조회
taskRouter.get('/tasks/:taskId', authenticate, authorize.projectMember, asyncHandler(taskControl.getDetail));

// 할 일 수정
taskRouter.patch('/tasks/:taskId', authenticate, authorize.projectMember, upload.array('files'), asyncHandler(taskControl.update));

// 할 일 삭제 
taskRouter.delete('/tasks/:taskId', authenticate, authorize.projectMember, asyncHandler(taskControl.remove));

export default taskRouter;