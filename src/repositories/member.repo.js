import { prisma } from '../lib/prismaClient.js';

async function getList(projectId) {
  return prisma.invitation.findMany({
    where: { projectId },
    orderBy: [{ projectId: 'asc' }, { inviteeUserId: 'asc' }, { respondedAt: 'desc' }],
    distinct: ['projectId', 'inviteeUserId']
  });
}

async function erase(projectId, memberId) {
  const member = await prisma.projectMember.delete({
    where: { projectId_memberId: { projectId, memberId } }
  });
  return await prisma.invitation.update({
    where: { id: member.invitationId },
    data: { status: 'quit' }
  });
}

async function invite(projectId, inviteeUserId) {
  const invitation = await prisma.invitation.create({
    data: { projectId, id: inviteeUserId, status: 'pending' }
  });
  return invitation.id;
}

async function update(invitationId, statustr) {
  return await prisma.invitation.update({
    where: { id: invitationId },
    data: { status: statustr }
  });
}

async function create(invitationId, memberId, projectId) {
  return await prisma.projectMember.create({
    data: { invitationId, projectId, memberId }
  });
}

export default {
  getList,
  erase,
  invite,
  update,
  create
};
