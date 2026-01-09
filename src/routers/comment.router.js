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

// 1. 댓글 조회: 인증 & 인가 미들웨어 사용
commentRouter.patch('/:commentId', authenticate, authorize.projectMember, commentController.getCommentById);

// 2. 댓글 수정: 멤버 확인(미들웨어) + 본인 확인 및 개별 메시지(서비스)
commentRouter.patch('/:commentId', authenticate, authorize.commentAuthor, commentController.updateComment);

// 3. 댓글 삭제: 멤버 확인(미들웨어) + 본인 확인 및 개별 메시지(서비스)
commentRouter.delete('/:commentId', authenticate, authorize.commentAuthor, commentController.deleteComment);

export default commentRouter;

/**
 * @openapi
 * /comments/{commentId}:
 *   get:
 *     summary: 댓글 조회
 *     tags: [댓글]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, content, taskId, author, createdAt, updatedAt]
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 taskId:
 *                   type: integer
 *                 author:
 *                   type: object
 *                   required: [id, name, email, profileImage]
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     profileImage:
 *                       type: string
 *                       nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청 형식
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증(로그인) 필요
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: 인가(멤버) 필요
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 없음
 *
 *   patch:
 *     summary: 댓글 수정
 *     tags: [댓글]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, content, taskId, author, createdAt, updatedAt]
 *               properties:
 *                 id:
 *                   type: integer
 *                 content:
 *                   type: string
 *                 taskId:
 *                   type: integer
 *                 author:
 *                   type: object
 *                   required: [id, name, email, profileImage]
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     profileImage:
 *                       type: string
 *                       nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청 형식
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증(로그인) 필요
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: 인가(저자) 필요
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 없음
 *
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [댓글]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 삭제
 *       400:
 *         description: 잘못된 요청 형식
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증(로그인) 필요
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: 인가(멤버) 필요
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 없음
 */
