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
