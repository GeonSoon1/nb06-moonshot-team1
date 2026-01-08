import { prisma } from '../lib/prismaClient';
import { Prisma, Invitation, InvitationStatus } from '@prisma/client';

async function getList(projectId: number, page: number, limit: number) {
  return prisma.invitation.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      projectId,
      status: { in: [InvitationStatus.ACCEPTED, InvitationStatus.PENDING] }
    },
    orderBy: [{ projectId: 'asc' }, { inviteeUserId: 'asc' }, { respondedAt: 'desc' }],
    distinct: ['projectId', 'inviteeUserId']
  });
}

function findById(id: string): Promise<Invitation | null> {
  return prisma.invitation.findUnique({ where: { id } });
}

function update(id: string, status: InvitationStatus) {
  return prisma.invitation.update({
    where: { id },
    data: { status, respondedAt: new Date() }
  });
}

async function invite(data: Prisma.InvitationCreateInput) {
  return prisma.invitation.create({ data });
}

export default {
  getList,
  findById,
  update,
  invite
};
