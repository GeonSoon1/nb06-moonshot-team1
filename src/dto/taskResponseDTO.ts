import { Task } from '@prisma/client'


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

// 목록 조회 최종 응답 타입
export interface TaskListResponse {
  data: FormattedTask[];
  total: number;
}