import express from 'express';
import memberControl from '../controllers/member.control.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const memberRouter = express.Router();

memberRouter.get('/projects/:projectId/users', asyncHandler(memberControl.getList));
memberRouter.delete('/projects/:projectId/users/:userId', asyncHandler(memberControl.erase));
memberRouter.post('/projects/:projectId/invitations', asyncHandler(memberControl.invite));
memberRouter.post('/invitations/:invitationId/accept', asyncHandler(memberControl.accept));
memberRouter.delete('/invitations/:invitationId', asyncHandler(memberControl.cancel));

export default memberRouter;
