import { Prisma } from '@prisma/client';

export type CommentWithAuthorMember = Prisma.CommentGetPayload<{
  include: { author: { include: { member: true } } };
}>;

export type CommentDto = {
  id: number;
  content: string;
  taskId: number;
  author: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
};
