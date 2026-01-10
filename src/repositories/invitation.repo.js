import { prisma } from '../lib/prismaClient.js';

async function getList(projectId) {
  return prisma.invitation.findMany({
    where: { projectId },
    orderBy: [{ projectId: 'asc' }, { inviteeUserId: 'asc' }, { respondedAt: 'desc' }],
    distinct: ['projectId', 'inviteeUserId']
  });
}

function findById(id) {
  return prisma.invitation.findUnique({ where: { id } });
}

function update(id, status) {
  return prisma.invitation.update({
    where: { id },
    data: { status, respondedAt: new Date() }
  });
}

async function invite(data) {
  return prisma.invitation.create({ data });
}

export default {
  getList,
  findById,
  update,
  invite
};
