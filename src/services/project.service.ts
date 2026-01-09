import projectRepo from '../repositories/project.repo';
import invitationRepo from '../repositories/invitation.repo';
import { BadRequestError } from '../middlewares/errors/customError';
import { prisma } from '../lib/prismaClient';
import { CreateProjectDto, UpdateProjectDto } from '../dto/projectDto';
import { Prisma, MemberRole } from '@prisma/client';

// 프로젝트 목록 조회: 부가 기능
async function getProjectList() {
  const projectList = await projectRepo.getProjectList();
  const projectListWithCounts = projectList.map((p) => {
    const { id, name, description, projectMembers = [], tasks = [], ...rest } = p;

    const memberCount = projectMembers.length ?? 0; // 오너/관리자 포함
    const todoCount = tasks.filter((t) => t.status === 'TODO').length;
    const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const doneCount = tasks.filter((t) => t.status === 'DONE').length;

    return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
  });
  return { data: projectListWithCounts, total: projectListWithCounts.length };
}

// 프로젝트 생성
async function createProject(userId: number, projectData: CreateProjectDto) {
  const { name: nameStr, description: descriptionStr } = projectData;

  // 1. 유저당 최대 5개 제한 확인
  const count = await projectRepo.countProjects(userId);
  if (count >= 5) {
    console.log('프로젝트는 최대 5개까지만 생성할 수 있습니다');
    throw new BadRequestError('프로젝트는 최대 5개까지만 생성할 수 있습니다');
  }

  const p = await projectRepo.createProject(nameStr, descriptionStr, userId);
  const memberData = {
    role: MemberRole.OWNER,
    project: { connect: { id: p.id } },
    member: { connect: { id: p.ownerId } }
  };

  const owner = await projectRepo.createMember(memberData);
  console.log(owner);
  const pp = await projectRepo.findProjectById(p.id);
  const { id, name, description, projectMembers = [], tasks = [], ...rest } = pp;
  const memberCount = projectMembers.length ?? 0; // owner 포함
  const todoCount = tasks.filter((t) => t.status === 'TODO').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const doneCount = tasks.filter((t) => t.status === 'DONE').length;

  return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
}

//프로젝트 상세조회
async function getProject(projectId: number) {
  const p = await projectRepo.findProjectById(projectId);
  if (p) {
    const { id, name, description, projectMembers = [], tasks = [], ...rest } = p;
    const memberCount = projectMembers.length ?? 0; // owner 포함
    const todoCount = tasks.filter((t) => t.status === 'TODO').length;
    const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const doneCount = tasks.filter((t) => t.status === 'DONE').length;

    return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
  } else {
    return null;
  }
}

// 프로젝트 수정
async function updateProject(projectId: number, projectData: UpdateProjectDto) {
  const p = await projectRepo.updateProject(projectId, projectData);
  if (p) {
    const { id, name, description, projectMembers = [], tasks = [], ...rest } = p;
    const memberCount = projectMembers.length ?? 0; // owner 포함
    const todoCount = tasks.filter((t) => t.status === 'TODO').length;
    const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const doneCount = tasks.filter((t) => t.status === 'DONE').length;

    return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
  } else {
    return null;
  }
}

// 프로젝트 삭제
async function deleteProject(projectId: number) {
  await projectRepo.deleteProject(projectId);
}

// 프로젝트 멤버 목록 조회
// 승인/대기중인 멤버만 조회하여 상태와 함께 출력
async function getMemberList(projectId: number, page: number, limit: number) {
  const project = await projectRepo.findById(projectId);
  if (!project) {
    console.log('프로젝트가 존재하지 않습니다');
    throw new BadRequestError('잘못된 요청 형식');
    //throw new NotFoundError('프로젝트가 존재하지 않습니다');
  }
  const invitations = await invitationRepo.getList(projectId, page, limit);
  if (!invitations) {
    console.log('멤버가 존재하지 않습니다');
    throw new BadRequestError('잘못된 요청 형식');
  }

  const data = await Promise.all(
    invitations.map(async (i) => {
      const { inviteeUserId: id, status, id: invitationId } = i;
      const user = await prisma.user.findUniqueOrThrow({ where: { id } }); // User API로 대체
      const { name, email, profileImage } = user;

      // Task API로 대체
      const taskCount = await prisma.task.count({ where: { taskCreatorId: id } });
      return {
        id,
        name,
        email,
        profileImage,
        taskCount,
        status: status.toLowerCase(),
        invitationId
      };
    })
  );
  const ownerTasks = await prisma.task.findMany({
    where: { taskCreatorId: project.ownerId }
  });

  const ownerData = {
    id: project.owner.id,
    name: project.owner.name,
    email: project.owner.email,
    profileImage: project.owner.profileImage,
    taskCount: ownerTasks.length,
    status: 'owner',
    invitationId: null
  };

  return { data: [ownerData, ...data], total: data.length + 1 };
}

// 프로젝트 멤버 제외
async function deleteMember(projectId: number, userId: number) {
  const memberFound = await projectRepo.findMemberByIds(projectId, userId);
  if (!memberFound) {
    console.log('멤버/프로젝트가 존재하지 않습니다');
    throw new BadRequestError('잘못된 요청 형식');
    //throw new NotFoundError();
  }
  if (!memberFound.invitationId) {
    throw new BadRequestError('관리자는 제외시킬 수 없습니다');
  }
  const invitationFound = await invitationRepo.findById(memberFound.invitationId);
  if (!invitationFound) {
    throw new BadRequestError('초대 기록이 없습니다');
  }
  if (invitationFound.status !== 'ACCEPTED') {
    console.log('승인된 초대가 없습니다');
    throw new BadRequestError('잘못된 요청 형식');
    //throw new NotFoundError();
  }

  // transaction 사용: Invitation update & ProjectMember delete
  const [invitation, member] = await prisma.$transaction([
    invitationRepo.update(invitationFound.id, 'QUIT'),
    projectRepo.deleteMember(projectId, userId)
  ]);
  console.log(member);
  return invitation;
}

// 프로젝트 맴버 초대
async function inviteMember(projectId: number, email: string) {
  // User API로 대체
  const user = await prisma.user.findUnique({
    where: { email },
    include: { ownedProjects: true, invitations: true, projectMembers: true }
  });
  if (!user) {
    console.log('존재하지 않는 유저입니다');
    throw new BadRequestError('잘못된 요청 형식');
  }
  const invitationOk = okToSendInvitation(user, projectId) && !isOwner(user, projectId);
  if (!invitationOk) {
    console.log('초대할 수 없는 유저입니다. 프로젝트 관리자/멤버이거나 대기중인 초대가 있습니다');
    throw new BadRequestError('잘못된 요청 형식');
  }

  const inviation = await invitationRepo.invite({
    status: 'PENDING',
    project: { connect: { id: projectId } },
    inviteeUser: { connect: { id: user.id } }
  });
  return inviation.id;
}

//----------------------------------------- 지역 함수
function isOwner(user: Prisma.UserGetPayload<{ include: { ownedProjects: true } }>, projectId: number) {
  if (user.ownedProjects.length == 0) return false;
  return user.ownedProjects.some((p) => p.id === projectId);
}

function okToSendInvitation(user: Prisma.UserGetPayload<{ include: { invitations: true; projectMembers: true } }>, projectId: number) {
  if (user.invitations.length == 0) return true;
  const isPendingInvitation = user.invitations.some((i) => i.projectId === projectId && i.status === 'PENDING');
  const isMember = user.projectMembers.some((m) => m.projectId === projectId);
  return !isPendingInvitation && !isMember;
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
