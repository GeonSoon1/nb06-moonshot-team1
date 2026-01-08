import express from 'express';
import invitationControl from '../controllers/invitation.control';
import { asyncHandler } from '../middlewares/asyncHandler';
import authorize from '../middlewares/authorize';
import { authenticate } from '../middlewares/authenticate';

const invitationRouter = express.Router();

invitationRouter.post('/:invitationId/accept', authenticate, asyncHandler(invitationControl.accept));
invitationRouter.post('/:invitationId/reject', authenticate, asyncHandler(invitationControl.reject));
invitationRouter.delete('/:invitationId', authenticate, authorize.projectOwner, asyncHandler(invitationControl.cancel));

export default invitationRouter;

/**
 * @openapi
 * /invitations/{invitationId}/accept:
 *   post:
 *     summary: 멤버 초대 수락
 *     tags: [Invitation]
 *     security:
 *       - bearerAuth: []
 *     parameters:q
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 수락
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
 *       404:
 *         description: 없음
 *
 * /invitations/{invitationId}/reject:
 *   post:
 *     summary: 멤버 초대 거절
 *     tags: [Invitation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 거절
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
 *       404:
 *         description: 없음
 *
 * /invitations/{invitationId}:
 *   delete:
 *     summary: 멤버 초대 삭제
 *     tags: [Invitation]
 *     description: 프로젝트 관리자만 취소(삭제) 가능
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: 인가(관리자) 필요
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
