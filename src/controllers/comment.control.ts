import { create } from 'superstruct';
import { CreateComment, UpdateComment } from '../structs/comment.structs';
import { findById } from '../repositories/task.repo.js';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../middlewares/errors/customError';
import commentService from '../services/comment.service.js';
import projectRepo from '../repositories/project.repo';

// 할 일에 댓글 추가 (POST)
async function createComment(req: Request, res: Response, next: NextFunction) {
  const { id: userId } = req.user;
  const { taskId } = req.params;
  const { content } = req.body;

  const task = await findById(Number(taskId));
  if (!task) {
    console.log('해당 테스크가 없습니다');
    throw new BadRequestError('잘못된 요청');
  }
  const member = await projectRepo.findMemberByIds(task.projectId, userId);
  if (!member) {
    console.log('해당 프로젝트-멤버가 없습니다');
    throw new BadRequestError('잘못된 요청');
  }
  const commentData = {
    content,
    projectId: task.projectId,
    taskId: Number(taskId),
    authorId: userId
  };
  const commentDataOk = create(commentData, CreateComment);
  const newComment = await commentService.createComment(commentDataOk);
  return res.status(200).json(newComment);
}

// 2. 할 일에 달린 댓글 목록 조회 (GET / Pagination 반영)
async function getComments(req: Request, res: Response, next: NextFunction) {
  const { taskId } = req.params;
  const { page = 1, limit = 10 } = req.query; // 쿼리 스트링에서 페이지 정보 추출
  const userId = req.user.id;

  const result = await commentService.findAllByTaskId(
    Number(taskId),
    userId,
    Number(page),
    Number(limit)
  );
  return res.status(200).json(result);
}

//-------------------------------------------
// 1. 댓글 조회 (GET)
async function getCommentById(req: Request, res: Response, next: NextFunction) {
  const { commentId } = req.params;
  const comment = await commentService.getComment(Number(commentId));
  return res.status(200).json(comment);
}

// 4. 댓글 수정 (PATCH)
async function updateComment(req: Request, res: Response, next: NextFunction) {
  const { commentId } = req.params;
  const commentData = create(req.body, UpdateComment);
  const updatedComment = await commentService.updateComment(Number(commentId), commentData);
  return res.status(200).json(updatedComment);
}

// 5. 댓글 삭제 (DELETE)
async function deleteComment(req: Request, res: Response, next: NextFunction) {
  const { commentId } = req.params;
  const userId = req.user.id;

  await commentService.deleteComment(Number(commentId));

  // 명세서에 따라 성공 시 204 No Content 반환
  return res.status(204).end();
}

export default {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment
};
