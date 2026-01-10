import { prisma } from '../lib/prismaClient.js';

async function getProjectList() {
  return prisma.project.findMany({
    include: { projectMembers: true, tasks: true }
  });
}

async function countProjects(userId) {
  return prisma.project.count({ where: { ownerId: userId } });
}

async function createProject(name, description, userId) {
  return prisma.project.create({
    data: {
      name,
      description,
      ownerId: userId
    }
  });
}

async function updateProject(id, data) {
  return prisma.project.update({
    where: { id },
    data,
    include: {
      projectMembers: true,
      tasks: true
    }
  });
}

async function deleteProject(id) {
  return await prisma.project.delete({
    where: { id }
  });
}

async function findProjectById(id) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      projectMembers: true,
      tasks: true
    }
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
  return prisma.project.findUnique({
    where: { id },
    include: { owner: true }
  });
}

export default {
  getProjectList,
  createProject,
  countProjects,
  findProjectById,
  updateProject,
  deleteProject,
  findMemberByIds,
  deleteMember,
  createMember,
  findById
};
