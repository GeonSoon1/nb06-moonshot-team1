import { prisma } from '../lib/prismaClient.js';
import { Prisma, User } from '@prisma/client';
import {
  CreateUserInput,
  FindMyProjectsArgs,
  MyProjectRow,
  TaskStatusCountRow
} from '../types/user.js';

export class UserRepository {
  async findByUserEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }
  async createUser({ name, email, passwordHashed, profileImage }: CreateUserInput): Promise<User> {
    return prisma.user.create({
      data: { name, email, passwordHashed, profileImage }
    });
  }
  async update(
    userId: number,
    data: Prisma.UserUpdateInput
  ): Promise<{
    id: number;
    email: string;
    name: string;
    profileImage: string | null;
    createdAt: Date;
    updatedAt: Date;
  }> {
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
  async countMyProjects(userId: number): Promise<number> {
    return prisma.project.count({
      where: { OR: [{ ownerId: userId }, { projectMembers: { some: { memberId: userId } } }] }
    });
  }

  async findMyProjects(userId: number, args: FindMyProjectsArgs): Promise<MyProjectRow[]> {
    const { skip, take, orderBy } = args;
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
  async countTasks(projectIds: number[]): Promise<TaskStatusCountRow[]> {
    return prisma.task.groupBy({
      by: ['projectId', 'status'],
      where: { projectId: { in: projectIds } },
      _count: { _all: true }
    }) as any; //count는 계산해서 만들어내는 복잡한 제네릭 조건부 타입이라 반환부 타입과 완벽히 동일하다고 확신 못할 때가 많음.
    //그런데 number로 고정해놓아서 prisma가 만드는 타입이 복잡해서 지금 맥락에서는 확정하지 못한다고 함.
  }

  async getMyProjectIds(userId: number): Promise<number[]> {
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
    return Array.from(
      new Set<number>([...members.map((r) => r.projectId), ...owners.map((r) => r.id)])
    );
    // [...members.map(r => r.projectId), ...owners.map(r => r.id)]
    // => [1, 3, 5, 2, 5] 여기서 set은 중복 허용하지 않으니까 [1,3,5,2]가 됨
    //new Set([members.map(...), owners.map(...)])
    //new Set([[1,3,5], [2,5]]) 스프레드 문법 이 아니면 이렇게 됨
  }

  async findMyTasks(where: Prisma.TaskWhereInput) {
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
