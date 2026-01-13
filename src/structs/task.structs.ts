import * as s from 'superstruct';

// --- [1. 공통 타입 정의] ---

// 제목: 1~10자
const Title = s.size(s.string(), 1, 10);

// 내용: 최대 40자
const Description = s.size(s.string(), 0, 40);

// 상태: 정해진 값만 허용
const TaskStatus = s.enums(['todo', 'in_progress', 'done']);

const CoerceNumber = s.union([s.number(), s.string()]);

// "숫자처럼 생긴 문자열" -> number 로 변환까지 해주는 형태
const Int = s.coerce(
  s.refine(s.number(), 'Int', (v) => Number.isFinite(v) && Number.isInteger(v)),
  s.union([s.string(), s.number()]),
  (v) => (typeof v === 'string' ? Number(v) : v)
);

const TagList = s.size(s.array(s.string()), 0, 5); // 프론트 maxTags=5에 맞춤

// --- [2. API별 검증 스키마] ---

// [A] 할 일 생성 (POST)
export const CreateTask = s.object({
  title: Title,
  description: s.optional(s.nullable(Description)),
  startYear: Int,
  startMonth: Int,
  startDay: Int,
  endYear: Int,
  endMonth: Int,
  endDay: Int,
  status: s.optional(TaskStatus),
  tags: s.optional(TagList),
  assigneeId: s.optional(Int),
  attachments: s.optional(s.array(s.string()))
});

// [B] 할 일 수정 (PATCH)
export const UpdateTask = s.partial(CreateTask);

// [C] 할 일 목록 조회용 쿼리 (GET)
export const TaskQuery = s.object({
  page: s.defaulted(CoerceNumber, 1),
  limit: s.defaulted(CoerceNumber, 10),
  status: s.optional(TaskStatus),
  assignee: s.optional(CoerceNumber),
  keyword: s.optional(s.string()),
  order: s.optional(s.enums(['asc', 'desc'])),
  order_by: s.optional(s.enums(['created_at', 'name', 'end_date'])),
  // 민수님 추가: 첨부파일 유무 필터링 등을 위한 필드
  attachments: s.optional(s.array(s.string()))
});

// [D] URL 파라미터 검증
export const TaskParams = s.object({
  projectId: s.optional(CoerceNumber),
  taskId: s.optional(CoerceNumber)
});

export const TaskIdParam = s.object({
  taskId: CoerceNumber
});

export type TaskIdParamType = s.Infer<typeof TaskIdParam>;
