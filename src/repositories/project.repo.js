import { prisma } from '../lib/prismaClient.js';

async function getList() {
  return prisma.project.findMany({
    include: { projectMembers: true }
  });
}

export default {
  getList
};
