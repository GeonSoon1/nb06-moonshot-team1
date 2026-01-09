import { create } from 'superstruct';
import { UpdateComment } from '../structs/comment.structs';
import { Request, Response, NextFunction } from 'express';
import commentService from '../services/comment.service.js';

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
  getCommentById,
  updateComment,
  deleteComment
};
