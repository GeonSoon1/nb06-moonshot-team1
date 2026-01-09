"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskIdParam = exports.TaskQuery = exports.UpdateTask = exports.CreateTask = void 0;
const s = __importStar(require("superstruct"));
// --- [공통 타입 정의] ---
// 1. 제목: 문자열, 1~10자 사이
const Title = s.size(s.string(), 1, 10);
// 2. 내용(설명): 문자열, 최대 40자 (비어있을 수 있으므로 0부터 시작)
const Description = s.size(s.string(), 0, 40);
// 3. 태그: 문자열 배열, 0개에서 최대 3개까지만 허용
const TagList = s.size(s.array(s.string()), 0, 3);
// 4. 상태: 정해진 3가지 단어만 허용 (Enum 체크)
const TaskStatus = s.enums(['todo', 'in_progress', 'done']);
// 5. 숫자형 데이터: 숫자 또는 숫자로 된 문자열 허용 (Multipart 대응)
const CoerceNumber = s.union([s.number(), s.string()]);
// --- [API별 검증 스키마] ---
// [A] 할 일 생성 (POST)
exports.CreateTask = s.object({
    title: Title,
    description: s.optional(Description),
    startYear: CoerceNumber,
    startMonth: CoerceNumber,
    startDay: CoerceNumber,
    endYear: CoerceNumber,
    endMonth: CoerceNumber,
    endDay: CoerceNumber,
    status: s.optional(TaskStatus),
    tags: TagList,
    assigneeId: s.optional(CoerceNumber),
    attachments: s.optional(s.array(s.string()))
});
// [B] 할 일 수정 (PATCH)
// 모든 필드를 선택사항으로 만들어서 바꿀 것만 보내도 되게 함
exports.UpdateTask = s.partial(exports.CreateTask);
// [C] 할 일 목록 조회용 쿼리 (GET)
exports.TaskQuery = s.object({
    page: s.optional(CoerceNumber),
    limit: s.optional(CoerceNumber),
    status: s.optional(TaskStatus),
    assignee: s.optional(CoerceNumber),
    keyword: s.optional(s.string()),
    order: s.optional(s.enums(['asc', 'desc'])),
    order_by: s.optional(s.enums(['created_at', 'name', 'end_date']))
});
// [D] 할 일 조회용
exports.TaskIdParam = s.object({
    taskId: CoerceNumber // 아까 만든 숫자/문자열 허용 타입 재사용
});
