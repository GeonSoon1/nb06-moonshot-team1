import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getMyProjects, listMyTasks, myInfo, updateMyInfo } from '../controllers/user.control.js';
import { authenticate } from '../middlewares/authenticate.js';

const userRouter = express.Router();

userRouter.patch('/me', authenticate, asyncHandler(updateMyInfo));
userRouter.get('/me', authenticate, asyncHandler(myInfo));
userRouter.get('/me/projects', authenticate, asyncHandler(getMyProjects));
userRouter.get('/me/tasks', authenticate, asyncHandler(listMyTasks));

export default userRouter;

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [유저]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, email, name, profileImage, createdAt, updatedAt]
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                   format: email
 *                 name
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
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
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *           examples:
 *             notLoggedIn:
 *               summary: 인증(로그인) 필요
 *               value:
 *                 message: 로그인이 필요합니다
 *             expiredToken:
 *               summary: 토큰 만료
 *               value:
 *                 message: 토큰 만료
 *       404:
 *         description: 존재하지 않는 유저
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *   patch:
 *     summary: 내 정보 수정
 *     tags: [유저]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, email, name, profileImage, createdAt, updatedAt]
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                   format: email
 *                 name
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
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
 * /users/me/projects:
 *   get:
 *     summary: 참여 중인 프로젝트 조회
 *     tags: [유저]
 *     parameters:
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
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: 정렬 방향
 *       - in: query
 *         name: order_by
 *         schema:
 *           type: string
 *           enum: [created_at, name]
 *         description: 정렬 기준
 *     response:
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
 *                       id, name, description,
 *                       memberCount, todoCount, inProgressCount, doneCount,
 *                       createdAt, updatedAt]
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
 *         description: 잘못된 요청
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
 * /users/me/tasks:
 *   get:
 *     summary: 참여 중인 모든 프로젝트의 할 일 목록 조회
 *     tags: [유저]
 *     parameters:
 *       - in: query
 *         name: from
 *         description: 조회 시작 날짜 (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         description: 조회 종료 날짜 (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: project_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [todo, in_progress, done]
 *         description: 상태 필터
 *       - in: query
 *         name: asignee_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 딤당자 필터
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 제목 검색어
 *     response:
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
 *                       status, assignee, tags, attachments,
 *                       createdAt, updatedAt]
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
 *                             type: intger
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
 */
