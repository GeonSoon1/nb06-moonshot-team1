import { TaskStatus } from '@prisma/client';
import { ymdKst } from './calendar';
import { Prisma } from '@prisma/client';
import { PrismaVersion } from '../../generated/prisma/internal/prismaNamespace';
import { CommentWithAuthorMember } from '../../dto/commentDto';
import { TaskForFormat } from '../../types/task';

export const STATUS = {
  todo: 'TODO',
  in_progress: 'IN_PROGRESS',
  done: 'DONE'
} satisfies Record<'todo' | 'in_progress' | 'done', TaskStatus>;
//satisfies는 이 객체가 특정 타입을 만족하는지 검사하되, 객체 고유의 상세한 타입 정보(상수 값 등)는 그대로 유지해줘!"라는 뜻

// YYYY-MM-DD를 Date로 (단순 처리)
export function toStartOfDay(dateStr: string): Date {
  // UTC 기준으로 자정 , t : time 날짜와 시간의 구분, z : zulu time (utc기준임을 나타냄)
  return new Date(`${dateStr}T00:00:00.000Z`);
}
export function toEndOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T23:59:59.999Z`);
}

export function dateParts(d: Date): { year: number; month: number; day: number } {
  const ymd = ymdKst(d);
  const [yStr, mStr, dStr] = ymd.split('-');
  const year = Number(yStr);
  const month = Number(mStr);
  const day = Number(dStr);
  // (선택) 방어: 포맷 이상하면 여기서 바로 에러
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    throw new Error(`Invalid KST date format: ${ymd}`);
  }
  return { year, month, day };
}

export const formatTask = (task: TaskForFormat) => ({
  id: task.id,
  projectId: task.projectId,
  title: task.title,
  description: task.description,
  startYear: task.startDate.getFullYear(),
  startMonth: task.startDate.getMonth() + 1,
  startDay: task.startDate.getDate(),
  endYear: task.endDate.getFullYear(),
  endMonth: task.endDate.getMonth() + 1,
  endDay: task.endDate.getDate(),
  status: task.status.toLowerCase(),
  assignee: task.assigneeProjectMember
    ? {
        id: task.assigneeProjectMember.member.id,
        name: task.assigneeProjectMember.member.name,
        email: task.assigneeProjectMember.member.email,
        profileImage: task.assigneeProjectMember.member.profileImage
      }
    : null,
  tags: task.taskTags?.map((tt) => ({ id: tt.tag.id, name: tt.tag.name })) || [],
  attachments: task.attachments?.map((a) => a.url) || [],
  createdAt: task.createdAt,
  updatedAt: task.updatedAt
});

/**
 * DB에서 조회된 중첩된 댓글 데이터를 명세서 규격에 맞게 가공합니다.
 *
 */
export function formatComment(comment: CommentWithAuthorMember) {
  if (!comment) return null;

  return {
    id: comment.id,
    content: comment.content,
    taskId: comment.taskId,
    author: {
      id: comment.author.member.id,
      name: comment.author.member.name,
      email: comment.author.member.email,
      profileImage: comment.author.member.profileImage
    },
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt
  };
}
