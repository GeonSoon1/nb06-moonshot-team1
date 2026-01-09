import { CommentWithAuthorMember } from '../dto/commentDto';
import { prisma } from '../lib/prismaClient';
import { Prisma, Comment } from '@prisma/client';

async function findCommentById(id: number) {
  return prisma.comment.findUnique({
    where: { id }
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
  findCommentById,
  updateComment,
  deleteComment
};
