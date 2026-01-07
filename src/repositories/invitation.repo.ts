import { prisma } from '../lib/prismaClient';
import { InvitationStatus } from '../dto/dto';
import { Prisma, Invitation } from '@prisma/client';

async function getList(projectId: number) {
  return prisma.invitation.findMany({
    where: { projectId },
    orderBy: [{ projectId: 'asc' }, { inviteeUserId: 'asc' }, { respondedAt: 'desc' }],
    distinct: ['projectId', 'inviteeUserId']
  });
}

function findById(id: string) {
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
