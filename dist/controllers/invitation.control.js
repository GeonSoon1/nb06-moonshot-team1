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
const superstruct_1 = require("superstruct");
const projectMember_structs_1 = require("../structs/projectMember.structs");
const invitation_service_1 = __importDefault(require("../services/invitation.service"));
// accept, reject, cancel 을 하나로 합칠 것
function accept(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { invitationId } = req.params;
        // superstruct는 controller에서 하는게 정석이라고 하여 서비스에서 옮김
        const pendingInvitation = yield invitation_service_1.default.checkPending(invitationId);
        const memberData = {
            invitationId,
            projectId: pendingInvitation.projectId,
            memberId: pendingInvitation.inviteeUserId,
            role: 'MEMBER'
        };
        (0, superstruct_1.assert)(memberData, projectMember_structs_1.CreateProjectMember);
        const [invitation, member] = yield invitation_service_1.default.accept(invitationId, memberData);
        console.log('초대가 승인되어 새 멤버가 등록되었습니다');
        console.log(member);
        res.status(200).json(invitation);
    });
}
function reject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { invitationId } = req.params;
        const invitation = yield invitation_service_1.default.reject(invitationId);
        console.log('초대가 거절되었습니다');
        res.status(200).json(invitation);
    });
}
function cancel(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { invitationId } = req.params;
        const invitation = yield invitation_service_1.default.cancel(invitationId);
        console.log('초대가 취소되었습니다');
        res.status(200).json(invitation); //status = 'canceled'
        //res.status(204);
    });
}
exports.default = {
    accept,
    reject,
    cancel
};
