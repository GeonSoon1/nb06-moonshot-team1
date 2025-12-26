import { InvitationStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../lib/errors/customError.js';
import { prisma } from '../lib/prismaClient.js';
import memberRepo from '../repositories/member.repo.js';

async function getList(projectId) {
  const invitations = await memberRepo.getInvitationList(projectId);
  const selectedInvitations = invitations.filter(
    (i) => i.status === 'PENDING' || i.status === 'ACCEPTED'
  );
  const data = await Promise.all(
    selectedInvitations.map(async (i) => {
      const { inviteeUserId: id, status, invitationId } = i;
      const user = await prisma.user.findUniqueOrThrow({ where: { id } });
      const { name, email, profileImage } = user;
      const tasks = await prisma.task.findMany({
        where: { taskCreatorId: id }
      });
      return {
        id,
        name,
        email,
        profileImage,
        taskCount: tasks.length,
        status: status.toLowerCase(),
        invitationId
      };
    })
  );
  return { data, total: data.length };
}

// use transaction
async function erase(projectId, userId) {
  const memberFound = await memberRepo.findMemberByIds(projectId, userId);
  if (!memberFound) {
    console.log('No member found.');
    throw new NotFoundError('ProjectMember');
  }
  const invitationFound = await memberRepo.findInvitationById(memberFound.inviteId);
  if (invitationFound.status !== 'ACCEPTED') {
    console.log('No accepted invitation found.');
    throw new NotFoundError('Accepted Invitation');
  }

  const [invitation, member] = await prisma.$transaction([
    memberRepo.updateInvitation(invitationFound.invitationId, 'CANCELED'),
    memberRepo.eraseMember(projectId, userId)
  ]);
  return invitation;
}

// use transaction
async function accept(invitationId) {
  const invitationFound = await checkStatusPending(invitationId);

  const [invitation, member] = await prisma.$transaction([
    memberRepo.updateInvitation(invitationId, 'ACCEPTED'),
    memberRepo.createMember({
      projectId: invitationFound.projectId,
      memberId: invitationFound.inviteeUserId,
      inviteId: invitationFound.id,
      role: 'MEMBER'
    })
  ]);
  return invitation;
}

async function invite(projectId, email) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
    include: { ownedProjects: true, invitations: true, projectMembers: true }
  });

  const invitationOk = okToSendInvitation(user, projectId) && !isOwner(user, projectId);
  if (!invitationOk) {
    console.log('No invitation to this user (check owner, member, or pending invitation)');
    throw new BadRequestError('NO_INVITATION_TO_USER');
  }
  const invitationData = {
    invitationId: crypto.randomUUID(),
    projectId,
    inviteeUserId: user.id,
    status: 'PENDING'
  };
  const inviation = await memberRepo.inviteMember(invitationData);
  return inviation.invitationId;
}

async function reject(invitationId) {
  await checkStatusPending(invitationId);
  return await memberRepo.updateInvitation(invitationId, 'REJECTED');
}

async function cancel(invitationId) {
  await checkStatusPending(invitationId);
  return await memberRepo.updateInvitation(invitationId, 'CANCELED');
}

//------------------------ local functions
function isOwner(user, projectId) {
  if (user.ownedProjects.length == 0) return false;
  return user.ownedProjects.some((p) => p.id === projectId);
}

function okToSendInvitation(user, projectId) {
  if (user.invitations.length == 0) return true;
  const isPendingInvitation = user.invitations.some(
    (i) => i.projectId === projectId && i.status === 'PENDING'
  );
  const isMember = user.projectMembers.some((m) => m.projectId === projectId);
  return !isPendingInvitation && !isMember;
}

async function checkStatusPending(invitationId) {
  const invitation = await memberRepo.findInvitationByInvitationId(invitationId);
  if (invitation.status !== 'PENDING') {
    console.log('Invitation rejected/cancelled already');
    throw new BadRequestError('NO_INVITATION_PENDING');
  }
  return invitation;
}

export default {
  getList,
  erase,
  invite,
  accept,
  reject,
  cancel
};
