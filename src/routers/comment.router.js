import express from "express";
import { prisma } from "../lib/prismaClient.js"; // 인증 미들웨어와 동일한 경로 사용
import { CommentRepository } from "../repositories/comment.repo.js";
import { CommentService } from "../services/comment.service.js";
import { CommentController } from "../controllers/comment.control.js";
// import { authenticate } from "../middlewares/authenticate.js"; // 🛑 에러 방지를 위해 잠시 주석 처리

const router = express.Router();

/** * 🛑 임시 조치: 팀원의 인증 라이브러리(token.js) 에러를 우회하기 위한 임시 미들웨어입니다.
 * 이 미들웨어는 토큰 검사 없이 항상 유저 1번으로 로그인된 것으로 처리합니다.
 */
const tempAuth = (req, res, next) => {
  req.user = { id: 1 }; // DB에 존재하는 유저 ID 1번으로 가정
  next();
};

// 1. 의존성 주입 (레포지토리 -> 서비스 -> 컨트롤러 순으로 연결)
const commentRepository = new CommentRepository(prisma);

/** * 팀원 조율 결과: 다른 Repository가 완성되기 전이므로
 * 인자로 prisma만 직접 넘겨주어 독립적으로 작동하게 합니다. [cite: 2025-10-11]
 */
const commentService = new CommentService(commentRepository, prisma);
const commentController = new CommentController(commentService);

/** * 명세서의 주소 체계를 반영합니다.
 * 모든 댓글 관련 기능은 로그인이 필요하므로 임시로 tempAuth를 거칩니다.
 */

// 2. 댓글 생성: POST /tasks/:taskId/comments
router.post(
  "/tasks/:taskId/comments",
  tempAuth, // authenticate 대신 tempAuth 사용
  commentController.createComment
);

// 3. 댓글 목록 조회: GET /tasks/:taskId/comments
router.get("/tasks/:taskId/comments", tempAuth, commentController.getComments);

// 4. 댓글 수정: PATCH /comments/:commentId
router.patch("/comments/:commentId", tempAuth, commentController.updateComment);

// 5. 댓글 삭제: DELETE /comments/:commentId
router.delete(
  "/comments/:commentId",
  tempAuth,
  commentController.deleteComment
);

export default router;
