import { assert } from 'superstruct';
import { PatchProject, CreateProject } from '../structs/project.struct.js';
import projectService from '../services/project.service.js';

// 프로젝트 목록 조회: 인증, 부가 기능
async function getProjectList(req, res, next) {
  const projectListWithCounts = await projectService.getProjectList();
  console.log('프로젝트 목록을 조회합니다');
  res.status(200).json(projectListWithCounts);
}

// 프로젝트 생성: 인증
async function createProject(req, res, next) {
  const { id: userId } = req.user;
  const { name, description } = req.body;
  const projectData = { name, description, ownerId: userId };
  assert(projectData, CreateProject);
  const newProject = await projectService.createProject(userId, projectData);

  res.status(201).json(newProject);
}

// 내 프로젝트 조회: 인증, 인가(멤버)
async function getProject(req, res, next) {
  const { projectId } = req.params;
  const project = await projectService.getProject(Number(projectId));
  if (!project) {
    console.log('프로젝트를 찾을 수 없습니다.');
    res.status(404).json();
  } else res.status(200).json(project);
}

// 프로젝트 수정: 인증, 인가(오너)
async function updateProject(req, res, next) {
  const userId = 1; // [수정] 여기도 테스트용으로 1로 고정 (req.user 에러 방지)
  //const userId = req.user.id;
  const { projectId } = req.params;
  const { name, description } = req.body;
  const projectData = {
    name: name ?? undefined,
    description: description ?? undefined
  };
  assert(projectData, PatchProject);
  const updateProject = await projectService.updateProject(Number(projectId), projectData);

  res.status(200).json(updateProject);
}

// 프로젝트 삭제: 인증, 인가(오너)
async function deleteProject(req, res, next) {
  const { projectId } = req.params;

  await projectService.deleteProject(Number(projectId));
  console.log('프로젝트가 삭제되었습니다.');
  res.status(204).json();
}

// 프로젝트 멤버 조회
async function getMemberList(req, res, next) {
  const { projectId } = req.params;
  const members = await projectService.getMemberList(Number(projectId));
  console.log(`프로젝트${projectId}의 멤버 목록을 조회합니다`);
  res.status(200).json(members);
}

async function deleteMember(req, res, next) {
  const { projectId, userId } = req.params;
  const invitation = await projectService.deleteMember(Number(projectId), Number(userId));
  console.log(`프로젝트${projectId}에서 멤버${userId}(이)가 제외되었습니다`);
  res.status(200).json(invitation);
}

async function inviteMember(req, res, next) {
  const { projectId } = req.params;
  const { email } = req.body;
  const invitationId = await projectService.inviteMember(Number(projectId), email);
  console.log(`프로젝트${projectId}에서 ${email}로 초대 코드를 전송하였습니다`);
  res.status(201).json(invitationId);
  // 프론트엔드 시연에서 이메일 치고 초대하므로, req.body에서 email을 받아 이것으로 userId를 찾는 것으로 함
  // invitationId라는 것을 만들어 초대 코드로 res로 보냄
}

export default {
  getProjectList,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  getMemberList,
  deleteMember,
  inviteMember
};
