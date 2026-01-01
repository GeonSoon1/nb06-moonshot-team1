import { prisma } from '../lib/prismaClient.js';

async function getProjectList() {
  return prisma.project.findMany({
    include: { projectMembers: true, tasks: true }
  });
}

function findMemberByIds(projectId, memberId) {
  return prisma.projectMember.findUnique({
    where: { projectId_memberId: { projectId, memberId } }
  });
}

function deleteMember(projectId, memberId) {
  return prisma.projectMember.delete({
    where: { projectId_memberId: { projectId, memberId } }
  });
}

function createMember(data) {
  return prisma.projectMember.create({ data });
}

function findById(id) {
  return prisma.project.findUnique({ where: { id } });
}

export default {
  getProjectList,
  findMemberByIds,
  deleteMember,
  createMember,
  findById
};
