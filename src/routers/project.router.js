import express from 'express';
import projectControl from '../controllers/project.control.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

const projectRouter = express.Router();

projectRouter.get('/', asyncHandler(projectControl.getList));
// projectRouter.get('/:projectId', asyncHandler(projectControl.get));

export default projectRouter;
