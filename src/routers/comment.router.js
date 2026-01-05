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

// 1. 댓글 생성: 멤버 확인은 미들웨어에서, 내용은 서비스에서 검증
commentRouter.post(
  '/tasks/:taskId/comments',

  authenticate,
  authorize.projectMember,
  commentController.createComment
);

// 2. 댓글 목록 조회: 멤버라면 누구나 가능
commentRouter.get(
  '/tasks/:taskId/comments',

  authenticate,
  authorize.projectMember,
  commentController.getComments
);

// 3. 댓글 수정: 멤버 확인(미들웨어) + 본인 확인 및 개별 메시지(서비스)
commentRouter.patch(
  '/comments/:commentId',

  authenticate,
  authorize.commentAuthor,
  commentController.updateComment
);

// 4. 댓글 삭제: 멤버 확인(미들웨어) + 본인 확인 및 개별 메시지(서비스)
commentRouter.delete(
  '/comments/:commentId',

  authenticate,
  authorize.commentAuthor,
  commentController.deleteComment
);

export default commentRouter;
