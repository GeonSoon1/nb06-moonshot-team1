import { prisma } from "../lib/prismaClient";

async function getList(projectId) {
  return await prisma.invitation.findMany({
    where: { projectId },
    orderBy: { respondedAt: "desc" },
    distinct: [productId, memberId],
  });
}
