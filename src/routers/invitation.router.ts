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
 *     tags: [멤버]
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: 잘못된 요청 형식
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found
 */
/**
 * @openapi
 * /invitations/{invitationId}/reject:
 *   post:
 *     summary: 멤버 초대 거절 (부가 기능)
 *     tags: [멤버]
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: 잘못된 요청 형식
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found
 */
/**
 * @openapi
 * /invitations/{invitationId}:
 *   delete:
 *     summary: 멤버 초대 삭제
 *     tags: [멤버]
 *     description: 프로젝트 관리자만 취소(삭제) 가능
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: 잘못된 요청 형식
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: 로그인이 필요합니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               message: 권한이 없습니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found
 */
