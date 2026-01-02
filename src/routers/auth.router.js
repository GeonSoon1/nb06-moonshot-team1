import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { requireRefresh } from '../middlewares/refreshToken.js';
import {
  googleAuth,
  googleCallback,
  login,
  refresh,
  register
} from '../controllers/oAuth.control.js';

const authRouter = express.Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', asyncHandler(login));
authRouter.post('/refresh', requireRefresh, asyncHandler(refresh));
authRouter.get('/google', asyncHandler(googleAuth));
authRouter.get('/google/callback', asyncHandler(googleCallback));

export default authRouter;
