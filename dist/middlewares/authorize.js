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
const prismaClient_1 = require("../lib/prismaClient");
const customError_1 = require("./errors/customError");
function projectOwner(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                console.log('인증되지 않은 유저입니다. 로그인이 필요합니다');
                throw new customError_1.UnauthorizedError('로그인이 필요합니다');
            }
            const projectId = yield resolveProjectId(req.params);
            const project = yield prismaClient_1.prisma.project.findUniqueOrThrow({
                where: { id: projectId },
                select: { ownerId: true }
            });
            if (req.user.id !== project.ownerId) {
                console.log('권한이 없습니다. 프로젝트 관리자이어야 합니다');
                if (req.baseUrl.includes('invitations'))
                    throw new customError_1.ForbiddenError('권한이 없습니다');
                throw new customError_1.ForbiddenError('프로젝트 관리자가 아닙니다');
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function projectMember(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                console.log('인증되지 않은 유저입니다. 로그인이 필요합니다');
                throw new customError_1.UnauthorizedError('로그인이 필요합니다');
            }
            const projectId = yield resolveProjectId(req.params);
            const isMember = yield prismaClient_1.prisma.projectMember.findUnique({
                where: { projectId_memberId: { projectId, memberId: req.user.id } }
            });
            if (!isMember) {
                console.log('권한이 없습니다. 프로젝트 멤버이어야 합니다');
                throw new customError_1.ForbiddenError('프로젝트 멤버가 아닙니다');
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function commentAuthor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.user) {
                console.log('인증되지 않은 유저입니다. 로그인이 필요합니다');
                throw new customError_1.UnauthorizedError('로그인이 필요합니다');
            }
            const commentId = Number(req.params.commentId);
            if (Number.isNaN(commentId)) {
                console.log('댓글 아이디가 없습니다');
                throw new customError_1.BadRequestError('잘못된 요청 형식');
            }
            const comment = yield prismaClient_1.prisma.comment.findUniqueOrThrow({
                where: { id: commentId },
                select: { authorId: true }
            });
            if (req.user.id !== comment.authorId) {
                console.log('권한이 없습니다,. 자신이 작성한 댓글만 수정할 수 있습니다');
                throw new customError_1.ForbiddenError('자신이 작성한 댓글만 수정할 수 있습니다');
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
}
function resolveProjectId(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (params.invitationId) {
            const invitation = yield prismaClient_1.prisma.invitation.findUniqueOrThrow({
                where: { id: params.invitationId }
            });
            return Number(invitation.projectId);
        }
        if (params.subTaskId) {
            const subtask = yield prismaClient_1.prisma.subTask.findUniqueOrThrow({
                where: { id: Number(params.subTaskId) }
            });
            const task = yield prismaClient_1.prisma.task.findUniqueOrThrow({
                where: { id: subtask.taskId }
            });
            return task.projectId;
        }
        if (params.taskId) {
            const task = yield prismaClient_1.prisma.task.findUniqueOrThrow({
                where: { id: Number(params.taskId) }
            });
            return task.projectId;
        }
        if (params.projectId) {
            return Number(params.projectId);
        }
        console.log('요청 파라미터에 projectId, taskId, subTaskId, invitationId 중 하나가 있어야 합니다');
        throw new customError_1.BadRequestError('잘못된 요청 형식');
    });
}
exports.default = {
    projectOwner,
    projectMember,
    commentAuthor
};
