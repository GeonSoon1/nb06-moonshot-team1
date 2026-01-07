import { BadRequestError } from '../middlewares/errors/customError';
import { prisma } from '../lib/prismaClient';
import invitationRepo from '../repositories/invitation.repo';
import projectRepo from '../repositories/project.repo';
import { CreateMemberDto } from '../dto/dto';

// 초대 승인
async function accept(invitationId: string, memberData: CreateMemberDto) {
  // 트렌젝션 사용: Invitation table 수정 AND ProjectMember에 추가
  const [invitation, member] = await prisma.$transaction([
    invitationRepo.update(invitationId, 'ACCEPTED'),
    projectRepo.createMember(memberData)
  ]);
  return [invitation, member];
}

async function reject(invitationId: string) {
  await checkPending(invitationId);
  return await invitationRepo.update(invitationId, 'REJECTED');
}

async function cancel(invitationId: string) {
  await checkPending(invitationId);
  return await invitationRepo.update(invitationId, 'CANCELED');
}

async function checkPending(invitationId: string) {
  const invitation = await invitationRepo.findById(invitationId);
  if (!invitation) {
    console.log('초대 기록이 없습니다');
    throw new BadRequestError('잘못된 요청 형식');
    //throw new NotFoundError();
  }
  if (invitation.status !== 'PENDING') {
    console.log('대기 중인 초대가 아닙니다');
    throw new BadRequestError('잘못된 요청 형식');
  }
  return invitation;
}

export default {
  checkPending,
  accept,
  reject,
  cancel
};
