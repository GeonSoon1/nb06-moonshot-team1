import * as s from 'superstruct';

// // --- [공통 타입 정의] ---

// 1. 제목: 문자열, 1~10자 사이
const Title = s.size(s.string(), 1, 10);

// 2. 내용(설명): 문자열, 최대 40자 (비어있을 수 있으므로 0부터 시작)
const Description = s.size(s.string(), 0, 40);

// // 3. 태그: 문자열 배열, 0개에서 최대 3개까지만 허용
// const TagList = s.size(s.array(s.string()), 0, 3);

// 4. 상태: 정해진 3가지 단어만 허용 (Enum 체크)
const TaskStatus = s.enums(['todo', 'in_progress', 'done']);

// 5. 숫자형 데이터: 숫자 또는 숫자로 된 문자열 허용 (Multipart 대응)
const CoerceNumber = s.union([s.number(), s.string()]);

// // --- [API별 검증 스키마] ---

// // [A] 할 일 생성 (POST)
// export const CreateTask = s.object({
//   title: Title,
//   description: s.optional(Description),
//   startYear: CoerceNumber,
//   startMonth: CoerceNumber,
//   startDay: CoerceNumber,
//   endYear: CoerceNumber,
//   endMonth: CoerceNumber,
//   endDay: CoerceNumber,
//   status: s.optional(TaskStatus),
//   tags: TagList,
//   assigneeId: s.optional(CoerceNumber),
//   attachments: s.optional(s.array(s.string()))
// });

// // [B] 할 일 수정 (PATCH)
// // 모든 필드를 선택사항으로 만들어서 바꿀 것만 보내도 되게 함
// export const UpdateTask = s.partial(CreateTask);

// [C] 할 일 목록 조회용 쿼리 (GET)
export const TaskQuery = s.object({
  page: s.optional(CoerceNumber),
  limit: s.optional(CoerceNumber),
  status: s.optional(TaskStatus),
  assignee: s.optional(CoerceNumber),
  keyword: s.optional(s.string()),
  order: s.optional(s.enums(['asc', 'desc'])),
  order_by: s.optional(s.enums(['created_at', 'name', 'end_date'])),
  attachments: s.optional(s.array(s.string()))
});

// // // [D] 할 일 조회용
export const TaskIdParam = s.object({
  taskId: CoerceNumber // 아까 만든 숫자/문자열 허용 타입 재사용
});
//-----------------------------------------------------
//민수 추가
// "숫자처럼 생긴 문자열" -> number 로 변환까지 해주는 형태
const Int = s.coerce(
  s.refine(s.number(), 'Int', (v) => Number.isFinite(v) && Number.isInteger(v)),
  s.union([s.string(), s.number()]),
  (v) => (typeof v === 'string' ? Number(v) : v)
);

const TagList = s.size(s.array(s.string()), 0, 5); // 프론트 maxTags=5에 맞춤

export const CreateTask = s.object({
  title: Title,
  description: s.optional(Description),
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

export const UpdateTask = s.partial(CreateTask);
