import { prisma } from '../lib/prismaClient.js';
<<<<<<< HEAD
import {
  ForbiddenError,
  UnauthorizedError,
  BadRequestError
} from '../middlewares/errors/customError.js';
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js';
=======
import { ForbiddenError, UnauthorizedError, BadRequestError } from '../lib/errors/customError.js';
>>>>>>> 738d7be (🐛 fix : 인증 버그 수정)

async function projectOwner(req, res, next) {
  try {
    // if (!req.cookies[ACCESS_TOKEN_COOKIE_NAME]) {
    //   console.log('토큰이 만료되었습니다'); // 작동할지 모르겠음
    //   throw new UnauthorizedError('토큰 만료');
    // }
    if (!req.user) {
      console.log('인증되지 않은 유저입니다. 로그인이 필요합니다');
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    const projectId = Number(req.params.projectId);
    if (Number.isNaN(projectId)) {
      console.log('프로젝트 아이디가 없습니다');
      throw new BadRequestError('잘못된 요청 형식');
    }

    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { ownerId: true }
    });

    if (req.user.id !== project.ownerId) {
      console.log('권한이 없습니다. 프로젝트 관리자이어야 합니다');
      if (req.baseUrl.includes('invitations')) throw new ForbiddenError('권한이 없습니다');
      throw new ForbiddenError('프로젝트 관리자가 아닙니다');
    }

    next();
  } catch (err) {
    next(err);
  }
}

async function projectMember(req, res, next) {
  try {
    if (!req.user) {
      console.log('인증되지 않은 유저입니다. 로그인이 필요합니다');
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    const projectId = await resolveProjectId(req.params);
    const isMember = await prisma.projectMember.findUnique({
      where: { projectId_memberId: { projectId, memberId: req.user.id } }
    });

    if (!isMember) {
      console.log('권한이 없습니다. 프로젝트 멤버이어야 합니다');
      throw new ForbiddenError('프로젝트 멤버가 아닙니다');
    }
    next();
  } catch (err) {
    next(err);
  }
}

async function commentAuthor(req, res, next) {
  try {
    if (!req.user) {
      console.log('인증되지 않은 유저입니다. 로그인이 필요합니다');
      throw new UnauthorizedError('로그인이 필요합니다');
    }
    const commentId = Number(req.params.commentId);
    if (Number.isNaN(commentId)) {
      console.log('댓글 아이디가 없습니다');
      throw new BadRequestError('잘못된 요청 형식');
    }

    const comment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
      select: { authorId: true }
    });

    if (req.user.id !== comment.authorId) {
      console.log('권한이 없습니다,. 자신이 작성한 댓글만 수정할 수 있습니다');
      throw new ForbiddenError('자신이 작성한 댓글만 수정할 수 있습니다');
    }

    next();
  } catch (err) {
    next(err);
  }
}

async function resolveProjectId(params) {
  if (params.subTaskId) {
    const subtask = await prisma.subTask.findUniqueOrThrow({
      where: { id: Number(params.subTaskId) }
    });
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: subtask.taskId }
    });
    return task.projectId;
  }

  if (params.taskId) {
    const task = await prisma.task.findUniqueOrThrow({
      where: { id: Number(params.taskId) }
    });
    return task.projectId;
  }

  if (params.projectId) {
    return Number(params.projectId);
  }
  console.log('요청 파라미터에 projectId, taskId, subTaskId 중 하나가 있어야 합니다');
  throw new BadRequestError('잘못된 요청 형식');
}

export default {
  projectOwner,
  projectMember,
  commentAuthor
};
