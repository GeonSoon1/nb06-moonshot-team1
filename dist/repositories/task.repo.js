"use strict";
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
exports.findDeleteMetaById = exports.setGoogleEventId = exports.remove = exports.findProjectMember = exports.updateWithTransaction = exports.findById = exports.count = exports.findMany = exports.createTask = void 0;
exports.createSubTask = createSubTask;
exports.findSubTasksByTaskId = findSubTasksByTaskId;
exports.createComment = createComment;
exports.findAllByTaskId = findAllByTaskId;
const task_1 = require("../types/task");
const prismaClient_1 = require("../lib/prismaClient");
const createTask = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prismaClient_1.prisma.task.create({
        data,
        include: task_1.taskInclude
    });
    return task;
});
exports.createTask = createTask;
const findMany = (where, skip, take, orderBy) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.task.findMany({
        where,
        skip,
        take,
        orderBy,
        include: task_1.taskInclude
    });
});
exports.findMany = findMany;
const count = (where) => __awaiter(void 0, void 0, void 0, function* () {
    const totalCount = yield prismaClient_1.prisma.task.count({ where });
    return totalCount;
});
exports.count = count;
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prismaClient_1.prisma.task.findUnique({
        where: { id },
        include: task_1.taskInclude
    });
    return task;
});
exports.findById = findById;
const updateWithTransaction = (id, data, tags, attachments) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 태그 수정 로직
        if (tags) {
            yield tx.taskTag.deleteMany({ where: { taskId: id } });
            data.taskTags = {
                create: tags.map((name) => ({
                    tag: { connectOrCreate: { where: { name }, create: { name } } }
                }))
            };
        }
        // 첨부파일 수정 로직
        if (attachments) {
            yield tx.attachment.deleteMany({ where: { taskId: id } });
            data.attachments = {
                create: attachments.map((url) => ({ url }))
            };
        }
        // 최종 업데이트 실행
        const updated = yield tx.task.update({
            where: { id },
            data,
            include: task_1.taskInclude
        });
        return updated;
    }));
});
exports.updateWithTransaction = updateWithTransaction;
// projectMember인지 확인하는 부분
const findProjectMember = (projectId, memberId) => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield prismaClient_1.prisma.projectMember.findUnique({
        where: { projectId_memberId: { projectId, memberId } }
    });
    return member;
});
exports.findProjectMember = findProjectMember;
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.prisma.task.delete({ where: { id } });
});
exports.remove = remove;
// 하위 할 일 생성
function createSubTask(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prisma.subTask.create({
            data
        });
    });
}
// 하위 할 일 목록 조회 (특정 Task에 속한 것들)
function findSubTasksByTaskId(taskId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prisma.subTask.findMany({
            where: {
                taskId
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
    });
}
//민수 추가(캘린더)
const setGoogleEventId = (taskId, googleEventId) => prismaClient_1.prisma.task.update({
    where: { id: taskId },
    data: { googleEventId },
    include: {
        assigneeProjectMember: { include: { member: true } },
        taskTags: { include: { tag: true } },
        attachments: true
    }
});
exports.setGoogleEventId = setGoogleEventId;
//기존 findbyid가 인클루드가 커서 삭제용으로 가볍게 만들었습니다.
const findDeleteMetaById = (id) => prismaClient_1.prisma.task.findUnique({
    where: { id },
    select: {
        id: true,
        projectId: true,
        taskCreatorId: true,
        googleEventId: true
    }
});
exports.findDeleteMetaById = findDeleteMetaById;
function createComment(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.comment.create({ data });
    });
}
function findAllByTaskId(taskId, skip, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.comment.findMany({
            where: { taskId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { author: { include: { member: true } } } // util에서 member 필요해서 이중 include
        });
    });
}
