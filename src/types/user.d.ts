import { Prisma, TaskStatus } from '@prisma/client';

type CreateUserInput = {
  name: string;
  email: string;
  passwordHashed: string;
  profileImage?: string | null;
};

type ProjectOrderBy = Prisma.ProjectOrderByWithRelationInput;

type FindMyProjectsArgs = {
  skip: number;
  take: number;
  orderBy: ProjectOrderBy;
};

type MyProjectRow = {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count: { projectMembers: number };
};

type TaskStatusCountRow = {
  projectId: number;
  status: TaskStatus;
  _count: { _all: number };
};

//--------------서비스 단------------------

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  profileImage?: string | null;
};

type LoginInput = {
  email: string;
  password: string;
  deviceIdHash: string;
};

type UpdateMyInfoInput = {
  email?: string;
  name?: string;
  profileImage?: string | null;
  currentPassword?: string;
  newPassword?: string;
};

type PublicUser = Pick<User, 'id' | 'email' | 'name' | 'profileImage' | 'createdAt' | 'updatedAt'>;

type Paginated<T> = { data: T[]; total: number };

type OrderDir = 'asc' | 'desc';

type MyProjectsQuery = {
  page: number;
  limit: number;
  order?: OrderDir;
  order_by?: 'name' | 'created_at'; // 너 코드 기준: 'name' 아니면 createdAt로 감
};

type MyProjectsWithCount = {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type ListMyTasksQuery = {
  from?: string; // 'YYYY-MM-DD'
  to?: string; // 'YYYY-MM-DD'
  project_id?: number;
  status?: 'todo' | 'in_progress' | 'done';
  assignee_id?: number;
  keyword?: string;
};

type AssigneeUser = {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
};

type MyTasks = {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: 'todo' | 'in_progress' | 'done';
  assignee: AssigneeUser | null;
  tags: Array<{ id: number; name: string }>;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
};

type PageParams = {
  page: number;
  limit: number;
  order?: 'asc' | 'desc';
  order_by?: 'name' | 'created_at';
};
