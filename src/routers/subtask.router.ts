import express from 'express';
import subTaskControl from '../controllers/subtask.control'; // .js 필수
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticate } from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const subtaskRouter = express.Router();

// 상세 조회
subtaskRouter.get('/:subTaskId', authenticate, authorize.projectMember, asyncHandler(subTaskControl.getSubTask));
// 수정
subtaskRouter.patch('/:subTaskId', authenticate, authorize.projectMember, asyncHandler(subTaskControl.updateSubTask));

// 삭제
subtaskRouter.delete('/:subTaskId', authenticate, authorize.projectMember, asyncHandler(subTaskControl.deleteSubTask));

export default subtaskRouter;

/**
 * @openapi
 * /subtasks/{subtaskId}:
 *   get:
 *     summary: 하위 할 일 조회
 *     tags: [하위 할 일]
 *     parameters:
 *       - in: path
 *         name: subtaskId
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
 *               required: [id, title, taskId, status, createdAt, updatedAt]
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 taskId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 1
 *               title: "Write swagger"
 *               taskId: 42
 *               status: "in_progress"
 *               createdAt: "2026-01-08T05:12:34.000Z"
 *               updatedAt: "2026-01-08T06:01:10.000Z"
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
 *     summary: 하위 할 일 수정
 *     tags: [하위 할 일]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, title, taskId, status, createdAt, updatedAt]
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 taskId:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               id: 1
 *               title: "Write swagger"
 *               taskId: 42
 *               status: "in_progress"
 *               createdAt: "2026-01-08T05:12:34.000Z"
 *               updatedAt: "2026-01-08T06:01:10.000Z"
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
 *   delete:
 *     summary: 하위 할 일 삭제
 *     tags: [하위 할 일]
 *     parameters:
 *       - in: path
 *         name: subtaskId
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
