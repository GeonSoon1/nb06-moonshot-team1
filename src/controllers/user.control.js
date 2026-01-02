import bcrypt from 'bcrypt';
import { prisma } from '../lib/prismaClient.js';
import {
  PageParamsStruct,
  TaskLIstQueryStruct,
  UpdateInfoStruct
} from '../structs/user.structs.js';
import { create } from 'superstruct';
import { BadRequestError, ForbiddenError } from '../lib/errors/customError.js';
import { dateParts, STATUS, toEndOfDay, toStartOfDay } from '../lib/util.js';

//내 정보 조회
export async function myInfo(req, res) {
  const user = req.user;
  const { passwordHashed, ...userWithoutPassword } = user;
  return res.status(200).json(userWithoutPassword);
}

//내 정보 수정
export async function updateInfo(req, res) {
  const user = req.user;
  const { email, name, profileImage, currentPassword, newPassword } = create(
    req.body,
    UpdateInfoStruct
  );
  const passwordChange = currentPassword != null || newPassword != null;
  if (passwordChange && (!currentPassword || !newPassword)) {
    throw new BadRequestError('잘못된 데이터 형식');
  }
  const data = {};
  if (email !== undefined) data.email = email;
  if (name !== undefined) data.name = name;
  if (profileImage !== undefined) data.profileImage = profileImage;
  if (passwordChange) {
    if (!user.passwordHashed) {
      throw new ForbiddenError('소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.');
    }
    const ok = await bcrypt.compare(currentPassword, user.passwordHashed);
    if (!ok) {
      throw new ForbiddenError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    const salt = await bcrypt.genSalt(10);
    data.passwordHashed = await bcrypt.hash(newPassword, salt);
  }
  const updated = await prisma.user.update({
    where: { id: user.id },
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
  return res.status(200).send(updated);
}

//참여 중인 프로젝트 조회
export async function getMyProjects(req, res) {
  const userId = req.user.id;
  const { page, limit, order, order_by } = create(req.query, PageParamsStruct);
  const skip = (page - 1) * limit;
  const take = limit;
  // orderBy 매핑 (Struct가 안전하게 걸러주니까 여기선 매핑만)
  const orderBy = order_by === 'name' ? { name: order } : { createdAt: order }; // created_at
  // 내가 멤버인 프로젝트 + 내가 오너인 프로젝트 모으기
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
  const projectIds = Array.from(
    new Set([...members.map((r) => r.projectId), ...owners.map((r) => r.id)])
  );
  if (projectIds.length === 0) {
    return res.status(200).json({ data: [], total: 0 });
  }
  const total = await prisma.project.count({
    where: { id: { in: projectIds } }
  });
  const projects = await prisma.project.findMany({
    where: { id: { in: projectIds } },
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
  const pagedProjectIds = projects.map((p) => p.id);
  // task 상태별 count
  const grouped = await prisma.task.groupBy({
    by: ['projectId', 'status'],
    where: { projectId: { in: pagedProjectIds } },
    _count: { _all: true }
  });
  const statusCountMap = new Map();
  for (const row of grouped) {
    const cur = statusCountMap.get(row.projectId) ?? { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    cur[row.status] = row._count._all;
    statusCountMap.set(row.projectId, cur);
  }
  const data = projects.map((p) => {
    const sc = statusCountMap.get(p.id) ?? { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      memberCount: p._count.projectMembers,
      todoCount: sc.TODO,
      inProgressCount: sc.IN_PROGRESS,
      doneCount: sc.DONE,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    };
  });
  return res.status(200).json({ data, total });
}

//참여 중인 모든 프로젝트의 할 일 목록 조회
export async function listMyTasks(req, res) {
  const userId = req.user.id;
  const query = create(req.query, TaskLIstQueryStruct);
  const { from, to, project_id, status, assignee_id, keyword } = query;
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
  //배열 내의 중복된 값을 제거하고 유일한(Unique) 값들만 남김,
  const projectIds = Array.from(
    new Set([...members.map((r) => r.projectId), ...owners.map((r) => r.id)])
  );
  if (projectIds.length === 0) return res.status(200).json([]); //참여중인 프로젝트 없으면 빈 배열
  const where = {
    projectId: { in: projectIds }
  };
  if (project_id != null) {
    //project_id가 있으면 where.projectId = project_id로 “in 조건”을 덮어씀 (교체)
    if (!projectIds.includes(project_id)) throw new BadRequestError('잘못된 요청 형식');
    where.projectId = project_id;
  }
  if (status) {
    where.status = STATUS[status];
  }
  if (assignee_id != null) {
    where.assigneeProjectMemberId = assignee_id;
  }
  if (keyword) {
    where.title = { contains: keyword, mode: 'insensitive' };
  }
  if (from || to) {
    const fromDate = from ? toStartOfDay(from) : null;
    const toDate = to ? toEndOfDay(to) : null;

    if (fromDate && toDate && fromDate > toDate) {
      throw new BadRequestError('잘못된 요청 형식');
    }
    // where.AND는 “AND 안의 AND” where 자체가 이미 AND인데 왜 또 AND를 쓰냐면
    // 기간 조건이 2개가 같이 들어가야 하는 형태라서 깔끔하게 묶으려는 것
    // 기간이 겹치는 것”을 잡는 패턴이라서 AND 배열로 넣는 것
    where.AND = [
      ...(where.AND ?? []),
      ...(toDate ? [{ startDate: { lte: toDate } }] : []), //lte: 이하 (레스 덴 올 이퀄), startDate <= toDate
      ...(fromDate ? [{ endDate: { gte: fromDate } }] : []) //gte: 이상 (그레이터 덴 올 이퀄), endDate >= fromDate
    ];
  }
  const tasks = await prisma.task.findMany({
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

  const result = tasks.map((t) => {
    const s = dateParts(t.startDate);
    const e = dateParts(t.endDate);
    const statusLower =
      t.status === 'TODO' ? 'todo' : t.status === 'IN_PROGRESS' ? 'in_progress' : 'done';
    return {
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      startYear: s.year,
      startMonth: s.month,
      startDay: s.day,
      endYear: e.year,
      endMonth: e.month,
      endDay: e.day,
      status: statusLower,
      assignee: t.assigneeProjectMember?.member ?? null,
      tags: t.taskTags.map((x) => x.tag),
      attachments: t.attachments.map((a) => a.url),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    };
  });
  return res.status(200).json(result);
}
