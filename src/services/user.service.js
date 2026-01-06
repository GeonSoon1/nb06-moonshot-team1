import bcrypt from 'bcrypt';
import { BadRequestError, ForbiddenError } from '../middlewares/errors/customError.js';
import { userRepo } from '../repositories/user.repo.js';
import { dateParts, toEndOfDay, toStartOfDay } from '../lib/utils/util.js';

export class UserService {
  async updateMyInfo(user, input) {
    const { email, name, profileImage, currentPassword, newPassword } = input;
    // 비번 변경 의사 (둘 중 하나라도 오면 "변경하려는 것"으로 봄)
    const passwordChange = currentPassword != null || newPassword != null;
    // 하나만 오면 400
    if (passwordChange && (!currentPassword || !newPassword)) {
      throw new BadRequestError('잘못된 데이터 형식');
    }
    const patch = {};
    if (email !== undefined) patch.email = email;
    if (name !== undefined) patch.name = name;
    if (profileImage !== undefined) patch.profileImage = profileImage;
    if (passwordChange) {
      if (!user.passwordHashed) {
        throw new ForbiddenError('소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.');
      }
      const ok = await bcrypt.compare(currentPassword, user.passwordHashed);
      if (!ok) {
        throw new ForbiddenError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      patch.passwordHashed = await bcrypt.hash(newPassword, 10);
    }
    return userRepo.update(user.id, patch);
  }

  //내가 참여한 프로젝트 조회
  async getMyProjects(userId, { page, limit, order, order_by }) {
    const skip = (page - 1) * limit;
    const take = limit;
    const dir = order ?? 'desc';
    const orderBy = order_by === 'name' ? { name: dir } : { createdAt: dir };
    const total = await userRepo.countMyProjects(userId);
    if (total === 0) return { data: [], total: 0 };
    const projects = await userRepo.findMyProjects(userId, { skip, take, orderBy });
    const projectIds = projects.map((p) => p.id);
    const grouped = await userRepo.countTasks(projectIds);
    const statusCountMap = new Map();
    for (const row of grouped) {
      const existing = statusCountMap.get(row.projectId);
      if (!existing) {
        // 최초 생성 시 기본값 + 현재 status count 반영
        statusCountMap.set(row.projectId, {
          TODO: row.status === 'TODO' ? row._count._all : 0,
          IN_PROGRESS: row.status === 'IN_PROGRESS' ? row._count._all : 0,
          DONE: row.status === 'DONE' ? row._count._all : 0
        });
      } else {
        // 이미 있으면 해당 status만 업데이트
        existing[row.status] = row._count._all;
      }
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
    return { data, total };
  }

  //참여 중인 모든 프로젝트의 할 일 목록 조회
  async listMyTasks(userId, query) {
    const { from, to, project_id, status, assignee_id, keyword } = query;
    // 1) 내가 접근 가능한 프로젝트 ID들 확보 (멤버 + 오너)
    const projectIds = await userRepo.getMyProjectIds(userId);
    if (projectIds.length === 0) return [];
    // 2) where 조립
    const where = { projectId: { in: projectIds } };
    if (project_id != null) {
      // in 조건을 "교체"해서 단일 프로젝트만 조회
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
      // 기존 AND 유지하면서 기간 조건만 추가
      where.AND = [
        ...(where.AND ?? []),
        ...(toDate ? [{ startDate: { lte: toDate } }] : []),
        ...(fromDate ? [{ endDate: { gte: fromDate } }] : [])
      ];
    }
    // 3) DB 조회 (repo)
    const tasks = await userRepo.findMyTasks(where);
    // 4) 응답 포맷 매핑
    return tasks.map((t) => {
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
  }
}

export const userService = new UserService();
