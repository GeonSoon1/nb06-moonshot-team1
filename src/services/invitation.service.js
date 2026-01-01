import { BadRequestError, NotFoundError } from '../lib/errors/customError.js';
import { prisma } from '../lib/prismaClient.js';
import invitationRepo from '../repositories/invitation.repo.js';
import projectRepo2 from '../repositories/project.repo2.js';

// 초대 승인
async function accept(invitationId) {
  const invitationFound = await checkStatusPending(invitationId);

  // 트렌젝션 사용: Invitation table 수정 AND ProjectMember에 추가
  const [invitation, member] = await prisma.$transaction([
    invitationRepo.update(invitationId, 'ACCEPTED'),
    projectRepo2.createMember({
      invitationId,
      projectId: invitationFound.projectId,
      memberId: invitationFound.inviteeUserId,
      role: 'MEMBER'
    })
  ]);
  return [invitation, member];
}

async function reject(invitationId) {
  await checkStatusPending(invitationId);
  return await invitationRepo.update(invitationId, 'REJECTED');
}

async function cancel(invitationId) {
  await checkStatusPending(invitationId);
  return await invitationRepo.update(invitationId, 'CANCELED');
}

//-------------------------------------------- 지역 함수
async function checkStatusPending(invitationId) {
  const invitation = await invitationRepo.findById(invitationId);
  if (!invitation) {
    console.log('초대 기록이 없습니다');
    throw new NotFoundError();
  }
  if (invitation.status !== 'PENDING') {
    console.log('대기 중인 초대가 아닙니다');
    throw new BadRequestError('잘못된 요청 형식');
  }
  return invitation;
}

export default {
  accept,
  reject,
  cancel
};
