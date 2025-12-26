import { prisma } from '../lib/prismaClient.js';

async function getInvitationList(projectId) {
  return prisma.invitation.findMany({
    where: { projectId },
    orderBy: [{ projectId: 'asc' }, { inviteeUserId: 'asc' }, { respondedAt: 'desc' }],
    distinct: ['projectId', 'inviteeUserId']
  });
}

function eraseMember(projectId, memberId) {
  return prisma.projectMember.delete({
    where: { projectId_memberId: { projectId, memberId } }
  });
}

function findMemberByIds(projectId, memberId) {
  return prisma.projectMember.findUniqueOrThrow({
    where: { projectId_memberId: { projectId, memberId } }
  });
}

function findInvitationById(id) {
  return prisma.invitation.findUniqueOrThrow({ where: { id } });
}

function updateWithIds(projectId, inviteeUserId, status) {
  return prisma.invitation.update({
    where: { projectId, inviteeUserId, status: 'PENDING' },
    data: { status, respondedAt: new Date() }
  });
}

function createMember(data) {
  return prisma.projectMember.create({ data });
}

async function findInvitationByInvitationId(invitationId) {
  return prisma.invitation.findUniqueOrThrow({
    where: { invitationId }
  });
}
async function inviteMember(data) {
  return prisma.invitation.create({ data });
}

function updateInvitation(invitationId, status) {
  return prisma.invitation.update({
    where: { invitationId },
    data: { status, respondedAt: new Date() }
  });
}

export default {
  getInvitationList, // GET invitaion
  eraseMember, // DELETE projectMember
  findMemberByIds, // projectMember
  inviteMember, // CREATE invitation
  findInvitationByInvitationId, // GET invitation
  findInvitationById,
  findMemberByIds,
  updateInvitation, // UPDATE invitation
  updateWithIds,
  createMember // CREATE projectMember
};
