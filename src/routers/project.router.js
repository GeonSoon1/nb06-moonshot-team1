import express from 'express';
import projectControl from '../controllers/project.control.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticate } from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const projectRouter = express.Router();

projectRouter.get('/', authenticate, asyncHandler(projectControl.getProjectList)); // 목록조회: 인증
projectRouter.post('/', authenticate, asyncHandler(projectControl.createProject)); //생성: 인증
projectRouter.get('/:projectId', authenticate, authorize.projectMember, asyncHandler(projectControl.getProject)); // 상세조회: 인증, 인가(멤버)
projectRouter.patch('/:projectId', authenticate, authorize.projectOwner, asyncHandler(projectControl.updateProject)); // 수정: 인증, 인가(오너)
projectRouter.delete('/:projectId', authenticate, authorize.projectOwner, asyncHandler(projectControl.deleteProject)); // 삭제: 인증, 인가(오너)

// 아래는 프로젝트멤버
projectRouter.get('/:projectId/users', authenticate, authorize.projectMember, asyncHandler(projectControl.getMemberList)); // 멤버조회: 인증, 인가(멤버)
projectRouter.delete('/:projectId/users/:userId', authenticate, authorize.projectOwner, asyncHandler(projectControl.deleteMember)); //멤버 제외: 인증, 인가(오너)
projectRouter.post('/:projectId/invitations', authenticate, authorize.projectOwner, asyncHandler(projectControl.inviteMember)); // 멤버 초대: 인증, 인가(오너)

export default projectRouter;
