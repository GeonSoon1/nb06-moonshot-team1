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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_repo_1 = __importDefault(require("../repositories/project.repo"));
const invitation_repo_1 = __importDefault(require("../repositories/invitation.repo"));
const customError_1 = require("../middlewares/errors/customError");
const prismaClient_1 = require("../lib/prismaClient");
const client_1 = require("@prisma/client");
// 프로젝트 목록 조회: 부가 기능
function getProjectList() {
    return __awaiter(this, void 0, void 0, function* () {
        const projectList = yield project_repo_1.default.getProjectList();
        const projectListWithCounts = projectList.map((p) => {
            var _a;
            const { id, name, description, projectMembers = [], tasks = [] } = p, rest = __rest(p, ["id", "name", "description", "projectMembers", "tasks"]);
            const memberCount = (_a = projectMembers.length) !== null && _a !== void 0 ? _a : 0; // 오너/관리자 포함
            const todoCount = tasks.filter((t) => t.status === 'TODO').length;
            const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
            const doneCount = tasks.filter((t) => t.status === 'DONE').length;
            return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
        });
        return projectListWithCounts;
    });
}
// 프로젝트 생성
function createProject(userId, projectData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { name: nameStr, description: descriptionStr } = projectData;
        // 1. 유저당 최대 5개 제한 확인
        const count = yield project_repo_1.default.countProjects(userId);
        if (count >= 5) {
            console.log('프로젝트는 최대 5개까지만 생성할 수 있습니다');
            throw new customError_1.BadRequestError('프로젝트는 최대 5개까지만 생성할 수 있습니다');
        }
        const p = yield project_repo_1.default.createProject(nameStr, descriptionStr, userId);
        const memberData = {
            role: client_1.MemberRole.OWNER,
            project: { connect: { id: p.id } },
            member: { connect: { id: p.ownerId } }
        };
        const owner = yield project_repo_1.default.createMember(memberData);
        console.log(owner);
        const pp = yield project_repo_1.default.findProjectById(p.id);
        const { id, name, description, projectMembers = [], tasks = [] } = pp, rest = __rest(pp, ["id", "name", "description", "projectMembers", "tasks"]);
        const memberCount = (_a = projectMembers.length) !== null && _a !== void 0 ? _a : 0; // owner 포함
        const todoCount = tasks.filter((t) => t.status === 'TODO').length;
        const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
        const doneCount = tasks.filter((t) => t.status === 'DONE').length;
        return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
    });
}
//프로젝트 상세조회
function getProject(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const p = yield project_repo_1.default.findProjectById(projectId);
        if (p) {
            const { id, name, description, projectMembers = [], tasks = [] } = p, rest = __rest(p, ["id", "name", "description", "projectMembers", "tasks"]);
            const memberCount = (_a = projectMembers.length) !== null && _a !== void 0 ? _a : 0; // owner 포함
            const todoCount = tasks.filter((t) => t.status === 'TODO').length;
            const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
            const doneCount = tasks.filter((t) => t.status === 'DONE').length;
            return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
        }
        else {
            return null;
        }
    });
}
// 프로젝트 수정
function updateProject(projectId, projectData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const p = yield project_repo_1.default.updateProject(projectId, projectData);
        if (p) {
            const { id, name, description, projectMembers = [], tasks = [] } = p, rest = __rest(p, ["id", "name", "description", "projectMembers", "tasks"]);
            const memberCount = (_a = projectMembers.length) !== null && _a !== void 0 ? _a : 0; // owner 포함
            const todoCount = tasks.filter((t) => t.status === 'TODO').length;
            const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
            const doneCount = tasks.filter((t) => t.status === 'DONE').length;
            return { id, name, description, memberCount, todoCount, inProgressCount, doneCount };
        }
        else {
            return null;
        }
    });
}
// 프로젝트 삭제
function deleteProject(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield project_repo_1.default.deleteProject(projectId);
    });
}
// 프로젝트 멤버 목록 조회
// 승인/대기중인 멤버만 조회하여 상태와 함께 출력
function getMemberList(projectId, page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = yield project_repo_1.default.findById(projectId);
        if (!project) {
            console.log('프로젝트가 존재하지 않습니다');
            throw new customError_1.BadRequestError('잘못된 요청 형식');
            //throw new NotFoundError('프로젝트가 존재하지 않습니다');
        }
        const invitations = yield invitation_repo_1.default.getList(projectId, page, limit);
        if (!invitations) {
            console.log('멤버가 존재하지 않습니다');
            throw new customError_1.BadRequestError('잘못된 요청 형식');
        }
        const data = yield Promise.all(invitations.map((i) => __awaiter(this, void 0, void 0, function* () {
            const { inviteeUserId: id, status, id: invitationId } = i;
            const user = yield prismaClient_1.prisma.user.findUniqueOrThrow({ where: { id } }); // User API로 대체
            const { name, email, profileImage } = user;
            // Task API로 대체
            const taskCount = yield prismaClient_1.prisma.task.count({ where: { taskCreatorId: id } });
            return {
                id,
                name,
                email,
                profileImage,
                taskCount,
                status: status.toLowerCase(),
                invitationId
            };
        })));
        const ownerTasks = yield prismaClient_1.prisma.task.findMany({
            where: { taskCreatorId: project.ownerId }
        });
        const ownerData = {
            id: project.owner.id,
            name: project.owner.name,
            email: project.owner.email,
            profileImage: project.owner.profileImage,
            taskCount: ownerTasks.length,
            status: 'owner',
            invitationId: null
        };
        return { data: [ownerData, ...data], total: data.length + 1 };
    });
}
// 프로젝트 멤버 제외
function deleteMember(projectId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const memberFound = yield project_repo_1.default.findMemberByIds(projectId, userId);
        if (!memberFound) {
            console.log('멤버/프로젝트가 존재하지 않습니다');
            throw new customError_1.BadRequestError('잘못된 요청 형식');
            //throw new NotFoundError();
        }
        if (!memberFound.invitationId) {
            throw new customError_1.BadRequestError('관리자는 제외시킬 수 없습니다');
        }
        const invitationFound = yield invitation_repo_1.default.findById(memberFound.invitationId);
        if (!invitationFound) {
            throw new customError_1.BadRequestError('초대 기록이 없습니다');
        }
        if (invitationFound.status !== 'ACCEPTED') {
            console.log('승인된 초대가 없습니다');
            throw new customError_1.BadRequestError('잘못된 요청 형식');
            //throw new NotFoundError();
        }
        // transaction 사용: Invitation update & ProjectMember delete
        const [invitation, member] = yield prismaClient_1.prisma.$transaction([
            invitation_repo_1.default.update(invitationFound.id, 'QUIT'),
            project_repo_1.default.deleteMember(projectId, userId)
        ]);
        console.log(member);
        return invitation;
    });
}
// 프로젝트 맴버 초대
function inviteMember(projectId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        // User API로 대체
        const user = yield prismaClient_1.prisma.user.findUnique({
            where: { email },
            include: { ownedProjects: true, invitations: true, projectMembers: true }
        });
        if (!user) {
            console.log('존재하지 않는 유저입니다');
            throw new customError_1.BadRequestError('잘못된 요청 형식');
        }
        const invitationOk = okToSendInvitation(user, projectId) && !isOwner(user, projectId);
        if (!invitationOk) {
            console.log('초대할 수 없는 유저입니다. 프로젝트 관리자/멤버이거나 대기중인 초대가 있습니다');
            throw new customError_1.BadRequestError('잘못된 요청 형식');
        }
        const inviation = yield invitation_repo_1.default.invite({
            status: 'PENDING',
            project: { connect: { id: projectId } },
            inviteeUser: { connect: { id: user.id } }
        });
        return inviation.id;
    });
}
//----------------------------------------- 지역 함수
function isOwner(user, projectId) {
    if (user.ownedProjects.length == 0)
        return false;
    return user.ownedProjects.some((p) => p.id === projectId);
}
function okToSendInvitation(user, projectId) {
    if (user.invitations.length == 0)
        return true;
    const isPendingInvitation = user.invitations.some((i) => i.projectId === projectId && i.status === 'PENDING');
    const isMember = user.projectMembers.some((m) => m.projectId === projectId);
    return !isPendingInvitation && !isMember;
}
exports.default = {
    getProjectList,
    createProject,
    getProject,
    updateProject,
    deleteProject,
    getMemberList,
    deleteMember,
    inviteMember
};
