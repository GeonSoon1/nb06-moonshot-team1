import express from 'express';
import invitationControl from '../controllers/invitation.control.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import authorize from '../middlewares/authorize.js';
import { authenticate } from '../middlewares/authenticate.js';

const invitationRouter = express.Router();

invitationRouter.post(
  '/:invitationId/accept',
  authenticate,
  asyncHandler(invitationControl.accept)
);
invitationRouter.post(
  '/:invitationId/reject',
  authenticate,
  asyncHandler(invitationControl.reject)
);
invitationRouter.delete(
  '/:invitationId',
  authenticate,
  authorize.projectOwner,
  asyncHandler(invitationControl.cancel)
);

export default invitationRouter;
