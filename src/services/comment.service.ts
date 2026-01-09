import { Prisma } from '@prisma/client';
import { formatComment } from '../lib/utils/util';
import { NotFoundError, BadRequestError, ForbiddenError } from '../middlewares/errors/customError';
import commentRepo from '../repositories/comment.repo';

// 댓글 생성 (내용 검증 유지)
async function createComment(commentData: Prisma.CommentCreateManyInput) {
  return await commentRepo.createComment(commentData);
}

// 특정 테스크의 댓글  목록 조회
async function findAllByTaskId(taskId: number, userId: number, page: number, limit: number) {
  const skip = (Number(page) - 1) * Number(limit); // skip 계산 추가
  const comments = await commentRepo.findAllByTaskId(taskId, skip, limit);
  const formattedData = comments.map((c) => formatComment(c));
  return { formattedData, total: formattedData.length };
}

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
  findAllByTaskId,
  createComment,
  getComment,
  updateComment,
  deleteComment
};
