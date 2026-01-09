"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subtask_control_1 = __importDefault(require("../controllers/subtask.control")); // .js 필수
const asyncHandler_1 = require("../middlewares/asyncHandler");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = __importDefault(require("../middlewares/authorize"));
const subtaskRouter = express_1.default.Router();
// 상세 조회
subtaskRouter.get('/:subTaskId', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(subtask_control_1.default.getSubTask));
// 수정
subtaskRouter.patch('/:subTaskId', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(subtask_control_1.default.updateSubTask));
// 삭제
subtaskRouter.delete('/:subTaskId', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(subtask_control_1.default.deleteSubTask));
exports.default = subtaskRouter;
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
