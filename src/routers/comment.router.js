import express from 'express';
import { prisma } from '../lib/prismaClient.js';
import { CommentRepository } from '../repositories/comment.repo.js';
import { CommentService } from '../services/comment.service.js';
import { CommentController } from '../controllers/comment.control.js';
import { authenticate } from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js'; // 팀원 미들웨어
// const tempAuth = (req, res, next) => {
//   req.user = { id: 1 }; // DB에 존재하는 유저 ID 1번으로 가정
//   next();
// };

const commentRouter = express.Router();

// 의존성 주입
const commentRepository = new CommentRepository(prisma);
const commentService = new CommentService(commentRepository);
const commentController = new CommentController(commentService);


// 1. 댓글 수정: 멤버 확인(미들웨어) + 본인 확인 및 개별 메시지(서비스)
commentRouter.patch('/:commentId', authenticate, authorize.commentAuthor, commentController.updateComment);

// 2. 댓글 삭제: 멤버 확인(미들웨어) + 본인 확인 및 개별 메시지(서비스)
commentRouter.delete('/:commentId', authenticate, authorize.commentAuthor, commentController.deleteComment);

export default commentRouter;
