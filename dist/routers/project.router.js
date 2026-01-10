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
const project_control_1 = __importDefault(require("../controllers/project.control"));
const taskControl = __importStar(require("../controllers/task.control"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const authenticate_1 = require("../middlewares/authenticate");
const authorize_1 = __importDefault(require("../middlewares/authorize"));
const projectRouter = express_1.default.Router();
projectRouter.get('/', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(project_control_1.default.getProjectList)); // 목록조회: 인증
projectRouter.post('/', authenticate_1.authenticate, (0, asyncHandler_1.asyncHandler)(project_control_1.default.createProject)); //생성: 인증
projectRouter.get('/:projectId', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(project_control_1.default.getProject)); // 상세조회: 인증, 인가(멤버)
projectRouter.patch('/:projectId', authenticate_1.authenticate, authorize_1.default.projectOwner, (0, asyncHandler_1.asyncHandler)(project_control_1.default.updateProject)); // 수정: 인증, 인가(오너)
projectRouter.delete('/:projectId', authenticate_1.authenticate, authorize_1.default.projectOwner, (0, asyncHandler_1.asyncHandler)(project_control_1.default.deleteProject)); // 삭제: 인증, 인가(오너)
// 아래는 프로젝트멤버
projectRouter.get('/:projectId/users', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(project_control_1.default.getMemberList)); // 멤버조회: 인증, 인가(멤버)
projectRouter.delete('/:projectId/users/:userId', authenticate_1.authenticate, authorize_1.default.projectOwner, (0, asyncHandler_1.asyncHandler)(project_control_1.default.deleteMember)); //멤버 제외: 인증, 인가(오너)
projectRouter.post('/:projectId/invitations', authenticate_1.authenticate, authorize_1.default.projectOwner, (0, asyncHandler_1.asyncHandler)(project_control_1.default.inviteMember)); // 멤버 초대: 인증, 인가(오너)
// 프로젝트에 할 일 생성 (건순님)
projectRouter.post('/:projectId/tasks', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(taskControl.createtask));
// 프로젝트의 할 일 목록 조회 (건순님)
projectRouter.get('/:projectId/tasks', authenticate_1.authenticate, authorize_1.default.projectMember, (0, asyncHandler_1.asyncHandler)(taskControl.getList));
exports.default = projectRouter;
/**
 * @openapi
 * /projects:
 *   get:
 *     summary: 프로젝트 목록 조회
 *     tags: [프로젝트]
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
 *                     required: [id, name, description, memberCount, todoCount, inProgressCount, doneCount]
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       memberCount:
 *                         type: integer
 *                       todoCount:
 *                         type: integer
 *                       inProgressCount:
 *                         type: integer
 *                       doneCount:
 *                         type: integer
 *                 total:
 *                   type: integer
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
 *
 *   post:
 *     summary: 프로젝트 생성
 *     tags: [프로젝트]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 생성
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, name, description, memberCount, todoCount, inProgressCount, doneCount]
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 memberCount:
 *                   type: integer
 *                 todoCount:
 *                   type: integer
 *                 inProgressCount:
 *                   type: integer
 *                 doneCount:
 *                   type: integer
 *       400:
 *         description: 잘못된 데이터 형식
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
 *
 * /projects/{projectId}:
 *   get:
 *     summary: 프로젝트 조회
 *     tags: [프로젝트]
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *               required: [id, name, description, memberCount, todoCount, inProgressCount, doneCount]
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 memberCount:
 *                   type: integer
 *                 todoCount:
 *                   type: integer
 *                 inProgressCount:
 *                   type: integer
 *                 doneCount:
 *                   type: integer
 *       400:
 *         description: 잘못된 데이터 형식
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
 *     summary: 프로젝트 수정
 *     tags: [프로젝트]
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, name, description, memberCount, todoCount, inProgressCount, doneCount]
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 memberCount:
 *                   type: integer
 *                 todoCount:
 *                   type: integer
 *                 inProgressCount:
 *                   type: integer
 *                 doneCount:
 *                   type: integer
 *       400:
 *         description: 잘못된 데이터 형식
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
 *   delete:
 *     summary: 프로젝트 삭제
 *     tags: [프로젝트]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 삭제
 *       400:
 *         description: 잘못된 데이터 형식
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
 *
 * /projects/{projectId}/users:
 *   get:
 *     summary: 프로젝트 멤버 조회
 *     tags: [멤버]
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *                     required: [id, name, email, profileImage, taskCount, status, invitationId]
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                         format: email
 *                       profileImage:
 *                         type: string
 *                         nullable: true
 *                       taskCount:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [pending, accepted, rejected, owner]
 *                       invitationId:
 *                         type: string
 *                         nullable: true
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
 * /projects/{projectId}/users/{userId}:
 *   delete:
 *     summary: 프로젝트에서 유저 제외하기
 *     tags: [멤버]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 제외
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
 * /projects/{projectId}/invitations:
 *   post:
 *     summary: 프로젝트에 멤버 초대
 *     tags: [멤버]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: 초대 생성
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
 * /projects/{projectId}/tasks:
 *   post:
 *     summary: 프로젝트에 할 일 생성
 *     tags: [할 일]
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *       201:
 *         description: 생성
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
 *
 *   get:
 *     summary: 프로젝트의 할 일 목록 조회
 *     tags: [할 일]
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *         description: 상태 필터
 *       - in: query
 *         name: assignee
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 담당자 필터
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: 정렬 방향
 *       - in: query
 *         name: order_by
 *         schema:
 *           type: string
 *           enum: [created_at, name, end_date]
 *         description: 정렬 기준
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
 *                     required: [
 *                       id, projectId, title,
 *                       startYear, startMonth, startDay, endYear, endMonth, endDay,
 *                       status, assignee, tags, attachments, createdAt, updatedAt]
 *                     properties:
 *                       id:
 *                         type: integer
 *                       projectId:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       startYear:
 *                         type: integer
 *                       startMonth:
 *                         type: integer
 *                       startDay:
 *                         type: integer
 *                       endYear:
 *                         type: integer
 *                       endMonth:
 *                         type: integer
 *                       endDay:
 *                         type: integer
 *                       status:
 *                         type: string
 *                         enum: [todo, in_progress, done]
 *                       assignee:
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
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           required: [id, name]
 *                           properties:
 *                             id:
 *                               type: integer
 *                             name:
 *                               type: string
 *                       attachments:
 *                         type: array
 *                         items:
 *                           type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                   description: 필터 적용 후 전체 개수
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
