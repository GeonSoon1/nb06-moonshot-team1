import express from 'express';
import invitationControl from '../controllers/invitation.control.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const invitationRouter = express.Router();

invitationRouter.post('/:invitationId/accept', asyncHandler(invitationControl.accept));
invitationRouter.post('/:invitationId/reject', asyncHandler(invitationControl.reject));
invitationRouter.delete('/:invitationId', asyncHandler(invitationControl.cancel));

export default invitationRouter;
