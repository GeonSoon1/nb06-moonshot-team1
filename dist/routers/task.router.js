"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = __importDefault(require("../middlewares/authorize"));
const taskControl = __importStar(require("../controllers/task.control"));
const taskRouter = express_1.default.Router();
// 할 일 조회
taskRouter.get('/:taskId', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(taskControl.getDetail));
// 할 일 수정
taskRouter.patch('/:taskId', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(taskControl.update));
// 할 일 삭제
taskRouter.delete('/:taskId', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(taskControl.remove));
// 하위 할 일 생성 (지민님)
taskRouter.post('/:taskId/subtasks', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(taskControl.createSubTask));
// 하위 할 일 목록 조회 (지민님)
taskRouter.get('/:taskId/subtasks', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(taskControl.getSubTasks));
// 댓글 생성 (현우님)
taskRouter.post('/:taskId/comments', authenticate_1.authenticate, authorize_1.default.projectMember, taskControl.createComment);
// 댓글 목록 조회 (현우님)
taskRouter.get('/:taskId/comments', authenticate_1.authenticate, authorize_1.default.projectMember, taskControl.getComments);
exports.default = taskRouter;
/**
 * @openapi
 * /tasks/{taskId}:
 *   get:
 *     summary: 할 일 조회
 *     tags: [할 일]
 *     parameters:
 *       - in: path
 *         name: taskId
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
 *               required: [
 *                 id, projectId, title,
 *                 startYear, startMonth, startDay,
 *                 endYear, endMonth, endDay,
 *                 status, assignee, tags, attachments,
 *                 createdAt, updatedAt
 *               ]
 *               properties:
 *                 id:
 *                   type: integer
 *                 projectId:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 startYear:
 *                   type: integer
 *                 startMonth:
 *                   type: integer
 *                 startDay:
 *                   type: integer
 *                 endYear:
 *                   type: integer
 *                 endMonth:
 *                   type: integer
 *                 endDay:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                 assignee:
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
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, name]
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: string
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
 *     summary: 할 일 수정
 *     tags: [할 일]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, startYear, startMonth, startDay, endYear, endMonth, endDay, status]
 *             properties:
 *               title:
 *                 type: string
 *               startYear:
 *                 type: integer
 *               startMonth:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               startDay:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *               endYear:
 *                 type: integer
 *               endMonth:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               endDay:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 31
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: "File URL/path/key (e.g., S3 URL, CDN URL, storage key)"
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [
 *                 id, projectId, title,
 *                 startYear, startMonth, startDay,
 *                 endYear, endMonth, endDay,
 *                 status, assignee, tags, attachments,
 *                 createdAt, updatedAt
 *               ]
 *               properties:
 *                 id:
 *                   type: integer
 *                 projectId:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 startYear:
 *                   type: integer
 *                 startMonth:
 *                   type: integer
 *                 startDay:
 *                   type: integer
 *                 endYear:
 *                   type: integer
 *                 endMonth:
 *                   type: integer
 *                 endDay:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                 assignee:
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
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, name]
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: string
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
 *   delete:
 *     summary: 할 일 삭제
 *     tags: [할 일]
 *     parameters:
 *       - in: path
 *         name: taskId
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
 *
 * /tasks/{taskId}/subtasks:
 *   post:
 *     summary: 하위 할 일 생성
 *     tags: [하위 할 일]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
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
 *               title: "준비운동하기"
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
 *
 *   get:
 *     summary: 하위 할 일 목록 조회
 *     tags: [하위 할 일]
 *     parameters:
 *       - in: path
 *         name: taskId
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
 *               required: [data, total]
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, title, taskId, status, createdAt, updatedAt]
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       taskId:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [todo, in_progress, done]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
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
 *
 * /tasks/{taskId}/comments:
 *   post:
 *     summary: 할 일에 댓글 추가
 *     tags: [댓글]
 *     parameters:
 *       - in: path
 *         name: taskId
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
 *         description: 인가(멤버) 필요
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *   get:
 *     summary: 할 일에 달린 댓글 조회
 *     tags: [댓글]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [data, total]
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     required: [id, content, taskId, author, createdAt, updatedAt]
 *                     properties:
 *                       id:
 *                         type: integer
 *                       content:
 *                         type: string
 *                       taskId:
 *                         type: integer
 *                       author:
 *                         type: object
 *                         required: [id, name, email, profileImage]
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                             format: email
 *                           profileImage:
 *                             type: string
 *                             nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
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
 */
