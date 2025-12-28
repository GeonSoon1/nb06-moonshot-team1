import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { CommentRepository } from "../repositories/comment.repository.js";
import { CommentService } from "../services/comment.service.js";
import { CommentController } from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"; // 인증 미들웨어

const router = express.Router();

// 1. 의존성 주입 (레포지토리 -> 서비스 -> 컨트롤러 순으로 연결)
const commentRepository = new CommentRepository(prisma);
// 인자로 prisma만 직접 넘겨주면 됩니다.
const commentService = new CommentService(commentRepository, prisma);
const commentController = new CommentController(commentService);

/** * 명세서의 주소 체계를 반영합니다.
 * 모든 댓글 관련 기능은 로그인이 필요하므로 authMiddleware를 거칩니다.
 */

// 2. 댓글 생성: POST /tasks/:taskId/comments
router.post(
  "/tasks/:taskId/comments",
  authMiddleware,
  commentController.createComment
);

// 3. 댓글 목록 조회: GET /tasks/:taskId/comments
router.get(
  "/tasks/:taskId/comments",
  authMiddleware,
  commentController.getComments
);

// 4. 댓글 수정: PATCH /comments/:commentId
router.patch(
  "/comments/:commentId",
  authMiddleware,
  commentController.updateComment
);

// 5. 댓글 삭제: DELETE /comments/:commentId
router.delete(
  "/comments/:commentId",
  authMiddleware,
  commentController.deleteComment
);

export default router;
