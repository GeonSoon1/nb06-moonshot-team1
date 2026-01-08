import { prisma } from '../lib/prismaClient.js';
import { Prisma, ProjectMember } from '@prisma/client';

async function getProjectList(): Promise<Prisma.ProjectGetPayload<{ include: { projectMembers: true; tasks: true } }>[]> {
  return prisma.project.findMany({
    include: { projectMembers: true, tasks: true }
  });
}

async function countProjects(userId: number) {
  return prisma.project.count({ where: { ownerId: userId } });
}

async function createProject(name: string, description: string, userId: number) {
  return prisma.project.create({
    data: {
      name,
      description,
      ownerId: userId
    }
  });
}

async function updateProject(id: number, data: Prisma.ProjectUpdateInput) {
  return prisma.project.update({
    where: { id },
    data,
    include: {
      projectMembers: true,
      tasks: true
    }
  });
}

async function deleteProject(id: number) {
  return await prisma.project.delete({
    where: { id }
  });
}

async function findProjectById(id: number): Promise<Prisma.ProjectGetPayload<{ include: { projectMembers: true; tasks: true } }>> {
  return prisma.project.findUniqueOrThrow({
    where: { id },
    include: {
      projectMembers: true,
      tasks: true
    }
  });
}

function findMemberByIds(projectId: number, memberId: number): Promise<ProjectMember | null> {
  return prisma.projectMember.findUnique({
    where: { projectId_memberId: { projectId, memberId } }
  });
}

function deleteMember(projectId: number, memberId: number) {
  return prisma.projectMember.delete({
    where: { projectId_memberId: { projectId, memberId } }
  });
}

function createMember(data: Prisma.ProjectMemberCreateInput): Prisma.PrismaPromise<ProjectMember> {
  return prisma.projectMember.create({ data });
}

function findById(id: number) {
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
