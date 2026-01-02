//import { assert } from "superstruct";
import projectService2 from '../services/project.service2.js';

async function getProjectList(req, res, next) {
  const projectListWithCounts = await projectService2.getProjectList();
  console.log('프로젝트 목록을 조회합니다');
  res.status(200).json(projectListWithCounts);
}

async function getMemberList(req, res, next) {
  const { projectId } = req.params;
  const members = await projectService2.getMemberList(Number(projectId));
  console.log(`프로젝트${projectId}의 멤버 목록을 조회합니다`);
  res.status(200).json(members);
}

async function deleteMember(req, res, next) {
  const { projectId, userId } = req.params;
  const invitation = await projectService2.deleteMember(Number(projectId), Number(userId));
  console.log(`프로젝트${projectId}에서 멤버${userId}(이)가 제외되었습니다`);
  res.status(200).json(invitation);
}

async function inviteMember(req, res, next) {
  const { projectId } = req.params;
  const { email } = req.body;
  const invitationId = await projectService2.inviteMember(Number(projectId), email);
  console.log(`프로젝트${projectId}에서 ${email}로 초대 코드를 전송하였습니다`);
  res.status(201).json(invitationId);
  // 프론트엔드 시연에서 이메일 치고 초대하므로, req.body에서 email을 받아 이것으로 userId를 찾는 것으로 함
  // invitationId라는 것을 만들어 초대 코드로 res로 보냄
}

export default {
  getProjectList,
  getMemberList,
  deleteMember,
  inviteMember
};
