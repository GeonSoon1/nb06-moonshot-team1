import express from 'express';
import { upload } from '../middlewares/upload.js';
import { authenticate } from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import * as fileControl from '../controllers/file.control.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const fileRouter = express.Router();

/**
 * [1] 회원가입용 (단일 파일, 인증 없음)
 * POST /files/public
 */
fileRouter.post('/public', upload.single('image'), asyncHandler(fileControl.uploadSingle));

/**
 * [2] 할 일 첨부용 (다중 파일, 인증+권한 필수)
 * POST /files/projects/:projectId
 */
fileRouter.post('/projects/:projectId', authenticate, authorize.projectMember, upload.array('image'), asyncHandler(fileControl.uploadMultiple));

export default fileRouter;

/**
 * @openapi
 * /files/public:
 *   post:
 *     summary: 이미지 1장 업로드
 *     tags: [파일 업로드]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [url]
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *
 * /files/projects/{projectId}:
 *   post:
 *     summary: 프로젝트 이미지 다중 업로드
 *     tags: [파일 업로드]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 프로젝트 ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [urls]
 *               properties:
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: 인증(로그인) 필요
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: 프로젝트 멤버만 가능
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 */
