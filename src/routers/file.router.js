import express from 'express';
import { uploadProfile, uploadTaskFile } from '../middlewares/upload.js';
import * as fileControl from '../controllers/file.control.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const fileRouter = express.Router();

/**
 * 할 일 첨부파일 업로드 (범용: 모든 파일 허용)
 * 주소: POST /files
 */
fileRouter.post('/', uploadTaskFile.single('files'), asyncHandler(fileControl.uploadSingleFile));

/**
 * 회원가입용 프로필 업로드 (제한: 이미지만 허용)
 * 주소: POST /files/profile
 */
fileRouter.post(
  '/register',
  uploadProfile.single('files'),
  asyncHandler(fileControl.uploadSingleFile)
);

export default fileRouter;
