import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticate } from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import * as taskControl from '../controllers/task.control';

const taskRouter = express.Router();

// 할 일 조회
taskRouter.get('/:taskId', authenticate, authorize.projectMember, asyncHandler(taskControl.getDetail));

// 할 일 수정
taskRouter.patch('/:taskId', authenticate, authorize.projectMember, asyncHandler(taskControl.update));

// 할 일 삭제
taskRouter.delete('/:taskId', authenticate, authorize.projectMember, asyncHandler(taskControl.remove));

// 하위 할 일 생성 (지민님)
taskRouter.post('/:taskId/subtasks', authenticate, authorize.projectMember, asyncHandler(taskControl.createSubTask));

// 하위 할 일 목록 조회 (지민님)
taskRouter.get('/:taskId/subtasks', authenticate, authorize.projectMember, asyncHandler(taskControl.getSubTasks));

// 댓글 생성 (현우님)
taskRouter.post('/:taskId/comments', authenticate, authorize.projectMember, taskControl.createComment);

// 댓글 목록 조회 (현우님)
taskRouter.get('/:taskId/comments', authenticate, authorize.projectMember, taskControl.getComments);

export default taskRouter;

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
 *         description: OK
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
 *               message: 프로젝트 멤버가 아닙니다
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
 * /tasks/{taskId}:
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
 *           example:
 *             title: 매일 조금씩 적기
 *             startYear: 2026
 *             startMonth: 1
 *             startDay: 1
 *             endYear: 2026
 *             endMonth: 5
 *             endDay: 31
 *             status: in_progress
 *             assigneeId: 2
 *             tags: [작문]
 *             attachments: [첫일기쓰기.txt, 일기쓰기.txt]
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
 *         description: OK
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
 *               message: 프로젝트 멤버가 아닙니다
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
 * /tasks/{taskId}:
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
 *               message: 프로젝트 멤버가 아닙니다
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
 * /tasks/{taskId}/subtasks:
 *   post:
 *     summary: 하위 할 일 생성
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
 *           example:
 *             title: 한 줄이라도 매일 적기
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
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
 *               message: 프로젝트 멤버가 아닙니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @openapi
 * /tasks/{taskId}/subtasks:
 *   get:
 *     summary: 하위 할 일 목록 조회
 *     tags: [할 일]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
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
 *               message: 프로젝트 멤버가 아닙니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @openapi
 * /tasks/{taskId}/comments:
 *   post:
 *     summary: 할 일에 댓글 추가
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
 *           example:
 *             content: 매일 꾸준한게 답이에요
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
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
 *               message: 프로젝트 멤버가 아닙니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @openapi
 * /tasks/{taskId}/comments:
 *   get:
 *     summary: 할 일에 달린 댓글 조회
 *     tags: [할 일]
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
 *         description: OK
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
 *               message: 프로젝트 멤버가 아닙니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
