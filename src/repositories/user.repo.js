import { prisma } from '../lib/prismaClient.js';

export class UserRepository {
  async findByUserEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  }
  async createUser({ name, email, passwordHashed, profileImage }) {
    return prisma.user.create({
      data: { name, email, passwordHashed, profileImage }
    });
  }
  async update(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  // 일단은 컨벤션 맞추기 전에 유저 레포에 두기. 맞추면 프로젝트레포로 이동
  // 내가 owner 이거나, projectMembers에 내가 있으면 "내 프로젝트"
  async countMyProjects(userId) {
    return prisma.project.count({
      where: { OR: [{ ownerId: userId }, { projectMembers: { some: { memberId: userId } } }] }
    });
  }

  async findMyProjects(userId, { skip, take, orderBy }) {
    return prisma.project.findMany({
      where: { OR: [{ ownerId: userId }, { projectMembers: { some: { memberId: userId } } }] },
      orderBy,
      skip,
      take,
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { projectMembers: true } }
      }
    });
  }
  //마찬가지로 테스크로 이동
  async countTasks(projectIds) {
    return prisma.task.groupBy({
      by: ['projectId', 'status'],
      where: { projectId: { in: projectIds } },
      _count: { _all: true }
    });
  }

  async getMyProjectIds(userId) {
    const [members, owners] = await Promise.all([
      prisma.projectMember.findMany({
        where: { memberId: userId },
        select: { projectId: true }
      }),
      prisma.project.findMany({
        where: { ownerId: userId },
        select: { id: true }
      })
    ]);
    return Array.from(new Set([...members.map((r) => r.projectId), ...owners.map((r) => r.id)]));
    // [...members.map(r => r.projectId), ...owners.map(r => r.id)]
    // => [1, 3, 5, 2, 5] 여기서 set은 중복 허용하지 않으니까 [1,3,5,2]가 됨
    //new Set([members.map(...), owners.map(...)])
    //new Set([[1,3,5], [2,5]]) 스프레드 문법 이 아니면 이렇게 됨
  }

  async findMyTasks(where) {
    return prisma.task.findMany({
      where,
      orderBy: [{ startDate: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        projectId: true,
        title: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        assigneeProjectMember: {
          select: {
            member: { select: { id: true, name: true, email: true, profileImage: true } }
          }
        },
        taskTags: {
          select: {
            tag: { select: { id: true, name: true } }
          }
        },
        attachments: { select: { url: true } }
      }
    });
  }
}

export const userRepo = new UserRepository();
