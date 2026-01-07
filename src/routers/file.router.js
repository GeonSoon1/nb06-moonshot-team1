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
fileRouter.post(
  '/projects/:projectId', 
  authenticate, 
  authorize.projectMember, 
  upload.array('image'), 
  asyncHandler(fileControl.uploadMultiple)
);

export default fileRouter;