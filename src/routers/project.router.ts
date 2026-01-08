import express from 'express';
import projectControl from '../controllers/project.control';
import * as taskControl from '../controllers/task.control';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticate } from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import { upload } from '../middlewares/upload';

const projectRouter = express.Router();

projectRouter.get('/', authenticate, asyncHandler(projectControl.getProjectList)); // 목록조회: 인증
projectRouter.post('/', authenticate, asyncHandler(projectControl.createProject)); //생성: 인증
projectRouter.get('/:projectId', authenticate, authorize.projectMember, asyncHandler(projectControl.getProject)); // 상세조회: 인증, 인가(멤버)
projectRouter.patch('/:projectId', authenticate, authorize.projectOwner, asyncHandler(projectControl.updateProject)); // 수정: 인증, 인가(오너)
projectRouter.delete('/:projectId', authenticate, authorize.projectOwner, asyncHandler(projectControl.deleteProject)); // 삭제: 인증, 인가(오너)

// 아래는 프로젝트멤버
projectRouter.get('/:projectId/users', authenticate, authorize.projectMember, asyncHandler(projectControl.getMemberList)); // 멤버조회: 인증, 인가(멤버)
projectRouter.delete('/:projectId/users/:userId', authenticate, authorize.projectOwner, asyncHandler(projectControl.deleteMember)); //멤버 제외: 인증, 인가(오너)
projectRouter.post('/:projectId/invitations', authenticate, authorize.projectOwner, asyncHandler(projectControl.inviteMember)); // 멤버 초대: 인증, 인가(오너)

// 프로젝트에 할 일 생성 (건순님)
projectRouter.post('/:projectId/tasks', authenticate, authorize.projectMember, upload.array('files'), asyncHandler(taskControl.create));

// 프로젝트의 할 일 목록 조회 (건순님)
projectRouter.get('/:projectId/tasks', authenticate, authorize.projectMember, asyncHandler(taskControl.getList));

export default projectRouter;

/**
 * @openapi
 * /projects:
 *   get:
 *     summary: 프로젝트 목록 조회
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
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
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
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
 *     summary: 프로젝트 상세 조회
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
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
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
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
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
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
 *     tags: [ProjectMember]
 *     security:
 *       - bearerAuth: []
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
 *     summary: 프로젝트에서 유저 제외
 *     tags: [ProjectMember]
 *     security:
 *       - bearerAuth: []
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
 *     summary: 프로젝트 멤버 초대
 *     tags: [Invitation]
 *     security:
 *       - bearerAuth: []
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
 *   post:
 *     summary: 프로젝트 할 일 생성 (파일 업로드 포함)
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
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
 * /projects/{projectId}/tasks:
 *   get:
 *     summary: 프로젝트 할 일 목록 조회
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
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
