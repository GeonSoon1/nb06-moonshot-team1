import { prisma } from "../lib/prismaClient";

async function getList(projectId) {
  return await prisma.invitation.findMany({
    where: { projectId },
    orderBy: { respondedAt: "desc" },
    distinct: [productId, memberId],
  });
}

async function erase(projectId, inviteeUserId) {
  const member = await prisma.projectMember.delete({
    where: { projectId, inviteeUserId },
  });
  return await prisma.invitation.update({
    where: { invitationId: member.invitationId },
    data: { state: "quit" },
  });
}

async function invite(projectId, inviteeUserId) {
  const invitation = await prisma.invitation.create({
    data: { projectId, inviteeUserId },
  });
  return invitation.id;
}

export default {
  getList,
  erase,
};
