import memberRepo from '../repositories/member.repo.js';
import userRepo from '../repositories/user.repo.js';

async function getList(projectId) {
  const members = await memberRepo.getList(projectId);
  return { members, total: members.length };
}

async function erase(projectId, userId) {
  await memberRepo.erase(projectId, userId);
}

async function invite(projectId, email) {
  const user = await userRepo.findByEmail(email);
  return await memberRepo.invite(projectId, user.id);
}

async function accept(invitationId) {
  const invitation = await memberRepo.update(invitationId, 'ACCEPTED');
  return await memberRepo.create(invitationId, invitation.memberId, invitation.projectId);
}

async function cancel(invitationId) {
  return await memberRepo.update(invitationId, 'CANCELED');
}

export default {
  getList,
  erase,
  invite,
  accept,
  cancel
};
