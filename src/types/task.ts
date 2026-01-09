import { Prisma } from '@prisma/client';

export const taskInclude = {
  assigneeProjectMember: { include: { member: true } },
  taskTags: { include: { tag: true } },
  attachments: true
} satisfies Prisma.TaskInclude;

// DB에서 꺼낸 타입
export type TaskWithDetails = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

// task 생성 input 타입
export interface TaskInput {
  title: string;
  description?: string; // ?는 '없을 수도 있음'을 뜻합니다.
  startYear: number | string;
  startMonth: number | string;
  startDay: number | string;
  endYear: number | string;
  endMonth: number | string;
  endDay: number | string;
  status?: string;
  assigneeId?: number | string;
  tags?: string[]; // 문자열 배열이거나, 멀티파트일 땐 문자열일 수 있음
  attachments?: string[];
}

// task 목록 조회 input 타입
export interface TaskQueryInput {
  page?: number | string;
  limit?: number | string;
  status?: 'todo' | 'in_progress' | 'done' | string;
  assignee?: number | string;
  keyword?: string;
  order?: 'asc' | 'desc';
  order_by?: 'created_at' | 'name' | 'end_date';
}
//민수 추가
export type TaskDelete = Prisma.TaskGetPayload<{
  select: {
    id: true;
    projectId: true;
    taskCreatorId: true;
    googleEventId: true;
  };
}>;
