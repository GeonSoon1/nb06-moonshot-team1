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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = require("../middlewares/errors/customError");
const prismaClient_1 = require("../lib/prismaClient");
const invitation_repo_1 = __importDefault(require("../repositories/invitation.repo"));
const project_repo_1 = __importDefault(require("../repositories/project.repo"));
// 초대 승인
function accept(invitationId, memberData) {
    return __awaiter(this, void 0, void 0, function* () {
        const memberDataToRepo = {
            role: memberData.role,
            invitaionId: memberData.invitationId,
            project: { connect: { id: memberData.projectId } },
            member: { connect: { id: memberData.memberId } }
        };
        // 트렌젝션 사용: Invitation table 수정 AND ProjectMember에 추가
        const [invitation, member] = yield prismaClient_1.prisma.$transaction([
            invitation_repo_1.default.update(invitationId, 'ACCEPTED'),
            project_repo_1.default.createMember(memberDataToRepo)
        ]);
        return [invitation, member];
    });
}
function reject(invitationId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkPending(invitationId);
        return yield invitation_repo_1.default.update(invitationId, 'REJECTED');
    });
}
function cancel(invitationId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkPending(invitationId);
        return yield invitation_repo_1.default.update(invitationId, 'CANCELED');
    });
}
function checkPending(invitationId) {
    return __awaiter(this, void 0, void 0, function* () {
        const invitation = yield invitation_repo_1.default.findById(invitationId);
        if (!invitation) {
            console.log('초대 기록이 없습니다');
            throw new customError_1.BadRequestError('잘못된 요청 형식');
            //throw new NotFoundError();
        }
        if (invitation.status !== 'PENDING') {
            console.log('대기 중인 초대가 아닙니다');
            throw new customError_1.BadRequestError('잘못된 요청 형식');
        }
        return invitation;
    });
}
exports.default = {
    checkPending,
    accept,
    reject,
    cancel
};
