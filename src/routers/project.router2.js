import express from 'express';
import projectControl2 from '../controllers/project.control2.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const projectRouter2 = express.Router();

projectRouter2.get('/', asyncHandler(projectControl2.getProjectList));
projectRouter2.get('/:projectId/users', asyncHandler(projectControl2.getMemberList));
projectRouter2.delete('/:projectId/users/:userId', asyncHandler(projectControl2.deleteMember));
projectRouter2.post('/:projectId/invitations', asyncHandler(projectControl2.inviteMember));

export default projectRouter2;
