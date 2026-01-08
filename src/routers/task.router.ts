import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticate } from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import * as taskControl from '../controllers/task.control';
import { CommentRepository } from '../repositories/comment.repo';
import { CommentService } from '../services/comment.service';
import { CommentController } from '../controllers/comment.control';
import { prisma } from '../lib/prismaClient';

const taskRouter = express.Router();

// 의존성 주입
const commentRepository = new CommentRepository(prisma);
const commentService = new CommentService(commentRepository);
const commentController = new CommentController(commentService);

// 할 일 조회
taskRouter.get('/:taskId', authenticate, authorize.projectMember, asyncHandler(taskControl.getDetail));

// 할 일 수정
taskRouter.patch('/:taskId', authenticate, authorize.projectMember, asyncHandler(taskControl.update));

// 할 일 삭제
taskRouter.delete('/:taskId', authenticate, authorize.projectMember, asyncHandler(taskControl.remove));

// 하위 할 일 생성 (지민님)
taskRouter.post('/:taskId/subtasks', authenticate, authorize.projectMember, asyncHandler(taskControl.createSubTask));

// 하위 할 일 목록 조회 (지민님)
taskRouter.get('/:taskId/subtasks', authenticate, authorize.projectMember, asyncHandler(taskControl.getSubTasks));

// 댓글 생성 (현우님)
taskRouter.post('/:taskId/comments', authenticate, authorize.projectMember, commentController.createComment);

// 댓글 목록 조회 (현우님)
taskRouter.get('/:taskId/comments', authenticate, authorize.projectMember, commentController.getComments);

export default taskRouter;
