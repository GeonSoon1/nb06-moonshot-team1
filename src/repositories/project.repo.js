import { prisma } from '../lib/prismaClient.js';

async function getList() {
  return prisma.project.findMany({
    include: { projectMembers: true, tasks: true }
  });
}

export default {
  getList
};
