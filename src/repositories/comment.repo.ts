import { CommentWithAuthorMember } from '../dto/commentDto';
import { prisma } from '../lib/prismaClient';
import { Prisma, Comment } from '@prisma/client';

async function createComment(data: Prisma.CommentCreateManyInput): Promise<Comment> {
  return prisma.comment.create({ data });
}

async function findCommentById(id: number) {
  return prisma.comment.findUnique({
    where: { id }
  });
}

async function findAllByTaskId(taskId: number, skip: number, limit: number) {
  return prisma.comment.findMany({
    where: { taskId },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { author: { include: { member: true } } } // util에서 member 필요해서 이중 include
  });
}

async function updateComment(
  id: number,
  data: Prisma.CommentUpdateInput
): Promise<CommentWithAuthorMember> {
  return prisma.comment.update({
    where: { id },
    data,
    include: { author: { include: { member: true } } } // util에서 member 필요해서 이중 include
  });
}

async function deleteComment(id: number): Promise<Comment> {
  return prisma.comment.delete({ where: { id } });
}

export default {
  createComment,
  findCommentById,
  findAllByTaskId,
  updateComment,
  deleteComment
};
