import { prisma } from "../lib/prismaClient";

async function getList(projectId) {
  return await prisma.invitation.findMany({
    where: { projectId },
    orderBy: { respondedAt: "desc" },
    distinct: [productId, memberId],
  });
}

async function erase(projectId, userId) {
  const member = await prisma.projectMember.delete({
    where: { projectId, inviteeId },
  });
  return await prisma.invitation.update({
    where: { invitationId: member.invitationId },
    data: { state: "quit" },
  });
}

export default {
  getList,
  erase,
};
