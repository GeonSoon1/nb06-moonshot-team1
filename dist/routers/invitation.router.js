"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invitation_control_1 = __importDefault(require("../controllers/invitation.control"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const authorize_1 = __importDefault(require("../middlewares/authorize"));
const authenticate_1 = require("../middlewares/authenticate");
const invitationRouter = express_1.default.Router();
invitationRouter.post('/:invitationId/accept', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(invitation_control_1.default.accept));
invitationRouter.post('/:invitationId/reject', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(invitation_control_1.default.reject));
invitationRouter.delete('/:invitationId', authenticate_1.authenticate, authorize_1.default.projectOwner, (0, asyncHandler_1.asyncHandler)(invitation_control_1.default.cancel));
exports.default = invitationRouter;
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
 *     tags: [멤버]
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
