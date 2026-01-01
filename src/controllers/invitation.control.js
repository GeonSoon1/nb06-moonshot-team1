//import { assert } from "superstruct";
import invitationService from '../services/invitation.service.js';

// accept, reject, cancel 을 하나로 합칠 것
async function accept(req, res, next) {
  const { invitationId } = req.params;
  const [invitation, member] = await invitationService.accept(invitationId);
  console.log('초대가 승인되었습니다');
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
