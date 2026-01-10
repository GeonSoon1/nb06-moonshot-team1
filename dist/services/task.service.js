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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskInfo = exports.getTaskDetail = exports.getTaskList = exports.createNewTask = void 0;
exports.deleteTask = deleteTask;
exports.createSubTask = createSubTask;
exports.getSubTasks = getSubTasks;
exports.createComment = createComment;
exports.findAllByTaskId = findAllByTaskId;
const taskRepo = __importStar(require("../repositories/task.repo"));
const customError_1 = require("../middlewares/errors/customError");
const util_1 = require("../lib/utils/util");
const oAuth_repo_1 = require("../repositories/oAuth.repo");
const calendar_1 = require("../lib/utils/calendar");
const calendar_repo_1 = require("../repositories/calendar.repo");
const util_2 = require("../lib/utils/util");
// 생성
const createNewTask = (projectId, userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, description, startYear, startMonth, startDay, endYear, endMonth, endDay, status, tags, attachments } = body;
    if (isNaN(Number(startYear))) {
        throw new customError_1.BadRequestError('잘못된 요청 형식');
    }
    const data = {
        title: title,
        description: description,
        status: (status === null || status === void 0 ? void 0 : status.toUpperCase()) || 'TODO',
        startDate: new Date(Number(startYear), Number(startMonth) - 1, Number(startDay)),
        endDate: new Date(Number(endYear), Number(endMonth) - 1, Number(endDay)),
        projectId: projectId, //controller에서 Number()처리 했는지 확인해야함.
        taskCreatorId: userId,
        assigneeProjectMemberId: userId,
        taskTags: {
            create: tags === null || tags === void 0 ? void 0 : tags.map((name) => ({
                tag: {
                    connectOrCreate: { where: { name }, create: { name } }
                }
            }))
        },
        attachments: { create: (attachments === null || attachments === void 0 ? void 0 : attachments.map((url) => ({ url }))) || [] }
    };
    // 1) 민수 추가 - Task 먼저 생성
    const createdTask = yield taskRepo.createTask(data);
    // 2) 구글 연동 여부 확인 (연동 안돼있으면 그냥 리턴)
    const googleAccount = yield oAuth_repo_1.oAuthRepo.findGoogleToken(userId);
    if (!(googleAccount === null || googleAccount === void 0 ? void 0 : googleAccount.refreshTokenEnc)) {
        return (0, util_1.formatTask)(createdTask);
    }
    // 3) 연동돼 있으면 캘린더 이벤트 생성 시도 (실패해도 Task는 성공)
    try {
        const calendar = yield (0, calendar_1.getCalendarClient)(userId);
        const event = (0, calendar_1.taskToEvent)(createdTask);
        const resp = yield (0, calendar_repo_1.createCalendarEvent)(calendar, {
            calendarId: 'primary',
            event
        });
        const googleEventId = (_a = resp === null || resp === void 0 ? void 0 : resp.data) === null || _a === void 0 ? void 0 : _a.id;
        if (googleEventId) {
            const updatedTask = yield taskRepo.setGoogleEventId(createdTask.id, googleEventId);
            return (0, util_1.formatTask)(updatedTask);
        }
        return (0, util_1.formatTask)(createdTask);
    }
    catch (err) {
        console.warn('calendar sync failed', { err: String(err), taskId: createdTask.id, userId });
        return (0, util_1.formatTask)(createdTask);
    }
});
exports.createNewTask = createNewTask;
// 조회
const getTaskList = (projectId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, status, assignee, keyword, order = 'desc', order_by = 'created_at' } = query;
    const where = Object.assign(Object.assign(Object.assign({ projectId }, (status && { status: status.toUpperCase() })), (assignee && { assigneeProjectMemberId: Number(assignee) })), (keyword && { title: { contains: keyword, mode: 'insensitive' } }));
    // 정렬 조건
    const orderBy = {};
    if (order_by === 'created_at')
        orderBy.createdAt = order;
    else if (order_by === 'name')
        orderBy.title = order;
    else if (order_by === 'end_date')
        orderBy.endDate = order;
    const [tasks, total] = (yield Promise.all([
        taskRepo.findMany(where, (Number(page) - 1) * Number(limit), Number(limit), orderBy),
        taskRepo.count(where)
    ]));
    return { data: tasks.map((t) => (0, util_1.formatTask)(t)), total };
});
exports.getTaskList = getTaskList;
// 상세 조회
const getTaskDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield taskRepo.findById(id);
    if (!task) {
        throw new customError_1.NotFoundError();
    }
    return (0, util_1.formatTask)(task);
});
exports.getTaskDetail = getTaskDetail;
// 수정
const updateTaskInfo = (id, body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. 기존 할 일 조회
    const task = yield taskRepo.findById(id);
    if (!task) {
        throw new customError_1.NotFoundError();
    }
    // (attachments 포함)
    const { title, description, status, startYear, startMonth, startDay, endYear, endMonth, endDay, assigneeId, tags, attachments } = body;
    // 2. 권한 확인
    const requester = yield taskRepo.findProjectMember(task.projectId, userId);
    if (!requester)
        throw new customError_1.ForbiddenError('프로젝트 멤버가 아닙니다');
    // 3. 담당자 변경 시 검증
    if (assigneeId) {
        const member = yield taskRepo.findProjectMember(task.projectId, Number(assigneeId));
        if (!member)
            throw new customError_1.ForbiddenError('프로젝트 멤버가 아닙니다');
    }
    // 4. 업데이트 데이터 조립 (Prisma.TaskUpdateInput 형식)
    const updateData = {};
    if (title)
        updateData.title = title;
    if (description !== undefined)
        updateData.description = description;
    if (status)
        updateData.status = status.toUpperCase();
    if (startYear && startMonth && startDay) {
        updateData.startDate = new Date(Number(startYear), Number(startMonth) - 1, Number(startDay));
    }
    if (endYear && endMonth && endDay) {
        updateData.endDate = new Date(Number(endYear), Number(endMonth) - 1, Number(endDay));
    }
    if (assigneeId) {
        updateData.assigneeProjectMember = {
            connect: {
                projectId_memberId: {
                    projectId: task.projectId,
                    memberId: Number(assigneeId)
                }
            }
        };
    }
    //민수 추가
    let updatedTask = yield taskRepo.updateWithTransaction(id, updateData, tags, attachments);
    // 6) 캘린더 동기화 (비차단 방식)
    const syncUserId = task.taskCreatorId;
    const googleAccount = yield oAuth_repo_1.oAuthRepo.findGoogleToken(syncUserId);
    if (googleAccount === null || googleAccount === void 0 ? void 0 : googleAccount.refreshTokenEnc) {
        // 비동기로 날림 처리 → 실패해도 전체 흐름엔 영향 없음
        (0, calendar_1.syncCalendarEvent)(updatedTask, syncUserId).catch((err // any 사용함
        ) => {
            var _a;
            return console.warn('calendar sync failed (update)', {
                err: String(err),
                taskId: updatedTask.id,
                userId: syncUserId,
                googleEventId: (_a = updatedTask.googleEventId) !== null && _a !== void 0 ? _a : null
            });
        });
    }
    return (0, util_1.formatTask)(updatedTask);
});
exports.updateTaskInfo = updateTaskInfo;
// 삭제
function deleteTask(id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // 1) 삭제에 필요한 최소 정보 조회
        const task = yield taskRepo.findDeleteMetaById(id);
        if (!task)
            throw new customError_1.NotFoundError();
        // 2) 권한(프로젝트 멤버) 체크
        const requester = yield taskRepo.findProjectMember(task.projectId, userId);
        if (!requester)
            throw new customError_1.ForbiddenError('프로젝트 멤버가 아닙니다');
        // 3) DB 삭제 먼저
        yield taskRepo.remove(id);
        // 4) 캘린더 이벤트 삭제
        const syncUserId = task.taskCreatorId;
        const eventId = (_a = task.googleEventId) !== null && _a !== void 0 ? _a : undefined;
        if (eventId) {
            (() => __awaiter(this, void 0, void 0, function* () {
                const googleAccount = yield oAuth_repo_1.oAuthRepo.findGoogleToken(syncUserId);
                if (!(googleAccount === null || googleAccount === void 0 ? void 0 : googleAccount.refreshTokenEnc))
                    return;
                const calendar = yield (0, calendar_1.getCalendarClient)(syncUserId);
                yield (0, calendar_repo_1.deleteCalendarEvent)(calendar, {
                    calendarId: 'primary',
                    eventId
                });
            }))().catch((err) => {
                console.warn('calendar sync failed (delete)', {
                    err: String(err),
                    taskId: task.id,
                    userId: syncUserId,
                    googleEventId: task.googleEventId
                });
            });
        }
    });
}
// 하위 할 일 생성
function createSubTask(subTaskData) {
    return __awaiter(this, void 0, void 0, function* () {
        const subtask = yield taskRepo.createSubTask(Object.assign(Object.assign({}, subTaskData), { status: subTaskData.status }));
        const { id, title, taskId, status, createdAt, updatedAt } = subtask;
        return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
    });
}
// 하위 할 일 목록 조회
function getSubTasks(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const subTasks = yield taskRepo.findSubTasksByTaskId(taskId);
        const newSubTasks = subTasks.map((s) => {
            const { id, title, taskId, status, createdAt, updatedAt } = s;
            return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
        });
        return newSubTasks;
    });
}
// 댓글 생성 (내용 검증 유지)
function createComment(commentData) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield taskRepo.createComment(commentData);
    });
}
// 특정 테스크의 댓글  목록 조회
function findAllByTaskId(taskId, userId, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const skip = (Number(page) - 1) * Number(limit); // skip 계산 추가
        const comments = yield taskRepo.findAllByTaskId(taskId, skip, limit);
        const formattedData = comments.map((c) => (0, util_2.formatComment)(c));
        return { formattedData, total: formattedData.length };
    });
}
