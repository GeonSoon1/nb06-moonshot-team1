//import { assert } from "superstruct";
import memberService from '../services/member.service.js';

async function getList(req, res, next) {
  const { projectId } = req.params;
  const members = await memberService.getList(Number(projectId));
  console.log('Member list fetched');
  res.status(200).json(members);
}

async function erase(req, res, next) {
  const { projectId, userId } = req.params;
  const invitation = await memberService.erase(Number(projectId), Number(userId));
  console.log('Member excluded');
  res.status(200).json(invitation);
}

async function invite(req, res, next) {
  const { projectId } = req.params;
  const { email } = req.body;
  const invitationId = await memberService.invite(Number(projectId), email);
  console.log('Invitation sent');
  res.status(201).json(invitationId);
  // req.body에서 email을 받고, 이것으로 userId를 찾는 것이 아닐까?
  // invitationId라는 것을 만들어 초대 코드로 res로 보냄
}

// accept, reject, cancel 을 하나로 합칠 것
async function accept(req, res, next) {
  const { invitationId } = req.params;
  const invitation = await memberService.accept(invitationId);
  console.log('Invitation accepted');
  res.status(200).json(invitation);
}

async function reject(req, res, next) {
  const { invitationId } = req.params;
  const invitation = await memberService.reject(invitationId);
  console.log('Invitation rejected');
  res.status(200).json(invitation);
}

async function cancel(req, res, next) {
  const { invitationId } = req.params;
  const invitation = await memberService.cancel(invitationId);
  //res.status(204);
  console.log('Invitation canceled');
  res.status(200).json(invitation); //status = 'canceled'
}

export default {
  getList,
  erase,
  invite,
  accept,
  reject,
  cancel
};
