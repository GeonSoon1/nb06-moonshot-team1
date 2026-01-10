"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTask = exports.STATUS = void 0;
exports.toStartOfDay = toStartOfDay;
exports.toEndOfDay = toEndOfDay;
exports.dateParts = dateParts;
exports.formatComment = formatComment;
const calendar_1 = require("./calendar");
exports.STATUS = {
    todo: 'TODO',
    in_progress: 'IN_PROGRESS',
    done: 'DONE'
};
//satisfies는 이 객체가 특정 타입을 만족하는지 검사하되, 객체 고유의 상세한 타입 정보(상수 값 등)는 그대로 유지해줘!"라는 뜻
// YYYY-MM-DD를 Date로 (단순 처리)
function toStartOfDay(dateStr) {
    // UTC 기준으로 자정 , t : time 날짜와 시간의 구분, z : zulu time (utc기준임을 나타냄)
    return new Date(`${dateStr}T00:00:00.000Z`);
}
function toEndOfDay(dateStr) {
    return new Date(`${dateStr}T23:59:59.999Z`);
}
function dateParts(d) {
    const ymd = (0, calendar_1.ymdKst)(d);
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
const formatTask = (task) => {
    var _a, _b;
    return ({
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
        tags: ((_a = task.taskTags) === null || _a === void 0 ? void 0 : _a.map((tt) => ({ id: tt.tag.id, name: tt.tag.name }))) || [],
        attachments: ((_b = task.attachments) === null || _b === void 0 ? void 0 : _b.map((a) => a.url)) || [],
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
    });
};
exports.formatTask = formatTask;
/**
 * DB에서 조회된 중첩된 댓글 데이터를 명세서 규격에 맞게 가공합니다.
 *
 */
function formatComment(comment) {
    if (!comment)
        return null;
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
