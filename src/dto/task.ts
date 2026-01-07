import { Task } from '@prisma/client'
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
  attachments?: string[]
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

// 목록 조회 최종 응답 타입
export interface TaskListResponse {
  data: FormattedTask[];
  total: number;
}

// res.json()으로 보내기 전에 포맷팅
export interface FormattedTask {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: string;
  assignee: {
    id: number;
    name: string;
    email: string;
    profileImage: string | null;
  } | null;
  tags: { id: number; name: string }[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}
