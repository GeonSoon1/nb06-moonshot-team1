import express from 'express';
import { uploadProfile, uploadTaskFile } from '../middlewares/upload';
import * as fileControl from '../controllers/file.control';
import { asyncHandler } from '../middlewares/asyncHandler';

const fileRouter = express.Router();

// 할 일 첨부파일 업로드 (name="image"로 약속)
fileRouter.post('/', uploadTaskFile.single('image'), asyncHandler(fileControl.uploadSingleFile));

// 프로필 이미지 업로드 (name="image"로 약속)
fileRouter.post(
  '/profile',
  uploadProfile.single('image'),
  asyncHandler(fileControl.uploadSingleFile)
);

export default fileRouter;

/**
 * @openapi
 * /files/profile:
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
 * /files:
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
