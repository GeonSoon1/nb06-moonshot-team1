import express from 'express';
import projectControl2 from '../controllers/project.control2.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const projectRouter2 = express.Router();

projectRouter2.get('/', authenticate, asyncHandler(projectControl2.getProjectList));
projectRouter2.get(
  '/:projectId/users',
  authenticate,
  authorize.projectMember,
  asyncHandler(projectControl2.getMemberList)
);
projectRouter2.delete(
  '/:projectId/users/:userId',
  authenticate,
  authorize.projectOwner,
  asyncHandler(projectControl2.deleteMember)
);
projectRouter2.post(
  '/:projectId/invitations',
  authenticate,
  authorize.projectOwner,
  asyncHandler(projectControl2.inviteMember)
);

export default projectRouter2;
