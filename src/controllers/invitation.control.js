import { assert } from 'superstruct';
import { CreateProjectMember } from '../structs/projectMember.structs.js';
import invitationService from '../services/invitation.service.js';

// accept, reject, cancel 을 하나로 합칠 것
async function accept(req, res, next) {
  const { invitationId } = req.params;

  // superstruct는 controller에서 하는게 정석이라고 하여 서비스에서 옮김
  const pendingInvitation = await invitationService.checkPending(invitationId);
  const memberData = {
    invitationId,
    projectId: pendingInvitation.projectId,
    memberId: pendingInvitation.inviteeUserId,
    role: 'MEMBER'
  };
  assert(memberData, CreateProjectMember);

  const [invitation, member] = await invitationService.accept(invitationId, memberData);
  console.log('초대가 승인되어 새 멤버가 등록되었습니다');
  console.log(member);
  res.status(200).json(invitation);
}
async function reject(req, res, next) {
  const { invitationId } = req.params;
  const invitation = await invitationService.reject(invitationId);
  console.log('초대가 거절되었습니다');
  res.status(200).json(invitation);
}

async function cancel(req, res, next) {
  const { invitationId } = req.params;
  const invitation = await invitationService.cancel(invitationId);
  console.log('초대가 취소되었습니다');
  res.status(200).json(invitation); //status = 'canceled'
  //res.status(204);
}

export default {
  accept,
  reject,
  cancel
};
