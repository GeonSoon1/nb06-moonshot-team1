import { Prisma } from '@prisma/client';
import { formatComment } from '../lib/utils/util';
import { NotFoundError } from '../middlewares/errors/customError';
import commentRepo from '../repositories/comment.repo';

// 1. 조회
async function getComment(commentId: number) {
  return await commentRepo.findCommentById(commentId);
}

// 2. 수정
async function updateComment(commentId: number, commentData: Prisma.CommentUpdateInput) {
  const comment = await commentRepo.findCommentById(commentId);
  if (!comment) throw new NotFoundError('존재하지 않는 댓글입니다.');
  return formatComment(await commentRepo.updateComment(commentId, commentData));
}

// 4. 삭제
async function deleteComment(commentId: number) {
  const comment = await commentRepo.findCommentById(commentId);
  if (!comment) throw new NotFoundError('존재하지 않는 댓글입니다.');
  await commentRepo.deleteComment(commentId);
}

export default {
  getComment,
  updateComment,
  deleteComment
};
