import { prisma } from '../lib/prismaClient.js';
import { ForbiddenError, UnauthorizedError, BadRequestError } from '../lib/errors/customError.js';

async function projectOwner(req, res, next) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const projectId = Number(req.params.projectId);
    if (Number.isNaN(projectId)) {
      throw new BadRequestError('프로젝트 번호가 없습니다.');
    }

    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { ownerId: true }
    });

    if (req.user.id !== project.ownerId) {
      throw new ForbiddenError('프로젝트 오너가 아닙니다.');
    }

    next();
  } catch (err) {
    next(err);
  }
}

async function projectMember(req, res, next) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const projectId = await resolveProjectId(req.params);
    const isMember = await prisma.projectMember.findUnique({
      where: {
        projectId,
        memberId: req.user.id
      }
    });

    if (!isMember) throw new ForbiddenError('프로젝트 멤버가 아닙니다.');
    next();
  } catch (err) {
    next(err);
  }
}

async function commentAuthor(req, res, next) {
  try {
    if (!req.user) throw new UnauthorizedError();

    const commentId = Number(req.params.commentId);
    if (Number.isNaN(commentId)) {
      throw new BadRequestError('댓글 번호가 없습니다.');
    }

    const comment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
      select: { authorId: true }
    });

    if (req.user.id !== comment.authorId) {
      throw new ForbiddenError('댓글 저자가 아닙니다.');
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
  throw new BadRequestError('Invalid params');
}

export default {
  projectOwner,
  projectMember,
  commentAuthor
};
