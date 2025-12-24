import { prisma } from '../lib/prismaClient.js';

async function findByEmail(email) {
  return await prisma.user.findUniqueOrThrow({
    where: { email }
  });
}

export default {
  findByEmail
};
