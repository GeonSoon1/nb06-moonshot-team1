import express from 'express';
import { uploadProfile, uploadTaskFile } from '../middlewares/upload';
import * as fileControl from '../controllers/file.control';
import { asyncHandler } from '../middlewares/asyncHandler';

const fileRouter = express.Router();

// 할 일 첨부파일 업로드 (name="files"로 약속)
fileRouter.post('/', uploadTaskFile.single('files'), asyncHandler(fileControl.uploadSingleFile));

// 프로필 이미지 업로드 (name="files"로 약속)
fileRouter.post('/register', uploadProfile.single('image'), asyncHandler(fileControl.uploadSingleFile));

export default fileRouter;

/**
 * @openapi
 * /files:
 *   post:
 *     summary: 할 일 첨부파일 업로드
 *     tags: [파일 업로드]
 *     security: []
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
 *         description: Created
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
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: 잘못된 요청 형식
 *             schema:
 *               type: object
 *               required: [message]
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
 *               type: object
 *               required: [message]
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
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @openapi
 * /files/register:
 *   post:
 *     summary: 프로파일 이미지 업로드
 *     tags: [파일 업로드]
 *     security: []
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
 *         description: Created
 *         content:
 *           application/json:
 *             example:
 *               url: http://localhost:3000/image.png
 *             schema:
 *               type: object
 *               required: [url]
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: 잘못된 요청 형식
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found
 */
