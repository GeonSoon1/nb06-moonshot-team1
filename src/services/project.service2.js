import projectRepo2 from '../repositories/project.repo2.js';
import invitationRepo from '../repositories/invitation.repo.js';
import { NotFoundError, BadRequestError } from '../lib/errors/customError.js';
import { prisma } from '../lib/prismaClient.js';

// 프로젝트 목록 조회: 부가 기능
async function getProjectList() {
  const projectList = await projectRepo2.getProjectList();
  const projectListWithCounts = projectList.map((p) => {
    const { id, name, description, projectMembers = [], tasks = [], ...rest } = p;

    const memberCount = projectMembers.length - 1 ?? 0; // owner 제외
    const todoCount = tasks.filter((t) => t.status === 'TODO').length;
    const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const doneCount = tasks.filter((t) => t.status === 'DONE').length;

    return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
  });
  return projectListWithCounts;
}

// 멤버 목록 조회
// 승인/대기중인 멤버만 조회하여 상태와 함께 출력
async function getMemberList(projectId) {
  const project = await projectRepo2.findById(projectId);
  if (!project) {
    console.log('프로젝트가 존재하지 않습니다');
    throw new NotFoundError();
  }
  const invitations = await invitationRepo.getList(projectId);
  const selectedInvitations = invitations.filter(
    (i) => i.status === 'PENDING' || i.status === 'ACCEPTED'
  );
  const data = await Promise.all(
    selectedInvitations.map(async (i) => {
      const { inviteeUserId: id, status, invitationId } = i;
      const user = await prisma.user.findUniqueOrThrow({ where: { id } }); // User API로 대체
      const { name, email, profileImage } = user;
      const tasks = await prisma.task.findMany({
        // Task API로 대체
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

// 멤버 제외
async function deleteMember(projectId, userId) {
  const memberFound = await projectRepo2.findMemberByIds(projectId, userId);
  if (!memberFound) {
    console.log('멤버/프로젝트가 존재하지 않습니다');
    throw new NotFoundError();
  }
  const invitationFound = await invitationRepo.findById(memberFound.invitationId);
  if (invitationFound.status !== 'ACCEPTED') {
    console.log('승인된 초대가 없습니다');
    throw new NotFoundError();
  }
  // transaction 사용: Invitation update & ProjectMember delete
  const [invitation, member] = await prisma.$transaction([
    invitationRepo.update(invitationFound.id, 'CANCELED'), // 'quit' 만드는 게 좋겠음
    projectRepo2.deleteMember(projectId, userId)
  ]);
  return invitation;
}

// 맴버 초대
async function inviteMember(projectId, email) {
  const user = await prisma.user.findUnique({
    // User API로 대체
    where: { email },
    include: { ownedProjects: true, invitations: true, projectMembers: true }
  });
  if (!user) {
    console.log('존재하지 않는 유저입니다');
    throw new NotFoundError();
  }
  const invitationOk = okToSendInvitation(user, projectId) && !isOwner(user, projectId);
  if (!invitationOk) {
    console.log('초대할 수 없는 유저입니다. 프로젝트 관리자/멤버이거나 대기중인 초대가 있습니다');
    throw new BadRequestError('잘못된 요청 형식');
  }
  const inviation = await invitationRepo.invite({
    projectId,
    inviteeUserId: user.id,
    status: 'PENDING'
  });
  return inviation.id;
}

//----------------------------------------- 지역 함수
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

export default {
  getProjectList,
  getMemberList,
  deleteMember,
  inviteMember
};
