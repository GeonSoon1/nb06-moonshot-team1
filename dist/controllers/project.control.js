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
const project_struct_1 = require("../structs/project.struct");
const project_service_1 = __importDefault(require("../services/project.service"));
// 프로젝트 목록 조회: 인증, 부가 기능
function getProjectList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectListWithCounts = yield project_service_1.default.getProjectList();
        console.log('프로젝트 목록을 조회합니다');
        res.status(200).json(projectListWithCounts);
    });
}
// 프로젝트 생성: 인증
function createProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id: userId } = req.user;
        const { name, description } = req.body;
        const projectData = { name, description, ownerId: userId };
        (0, superstruct_1.assert)(projectData, project_struct_1.CreateProject);
        const newProject = yield project_service_1.default.createProject(userId, projectData);
        res.status(201).json(newProject);
    });
}
// 내 프로젝트 조회: 인증, 인가(멤버)
function getProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId } = req.params;
        const project = yield project_service_1.default.getProject(Number(projectId));
        if (!project) {
            console.log('프로젝트를 찾을 수 없습니다.');
            res.status(404).json();
        }
        else
            res.status(200).json(project);
    });
}
// 프로젝트 수정: 인증, 인가(오너)
function updateProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = 1; // [수정] 여기도 테스트용으로 1로 고정 (req.user 에러 방지)
        //const userId = req.user.id;
        const { projectId } = req.params;
        const { name, description } = req.body;
        const projectData = {
            name: name !== null && name !== void 0 ? name : undefined,
            description: description !== null && description !== void 0 ? description : undefined
        };
        (0, superstruct_1.assert)(projectData, project_struct_1.PatchProject);
        const updateProject = yield project_service_1.default.updateProject(Number(projectId), projectData);
        res.status(200).json(updateProject);
    });
}
// 프로젝트 삭제: 인증, 인가(오너)
function deleteProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId } = req.params;
        yield project_service_1.default.deleteProject(Number(projectId));
        console.log('프로젝트가 삭제되었습니다.');
        res.status(204).json();
    });
}
// 프로젝트 멤버 조회
function getMemberList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const projectId = Number(req.params.projectId);
        const members = yield project_service_1.default.getMemberList(projectId, page, limit);
        console.log(`프로젝트${projectId}의 멤버 목록을 조회합니다`);
        res.status(200).json(members);
    });
}
// 프로젝트 멤버 제외
function deleteMember(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId, userId } = req.params;
        const invitation = yield project_service_1.default.deleteMember(Number(projectId), Number(userId));
        console.log(`프로젝트${projectId}에서 멤버${userId}(이)가 제외되었습니다`);
        res.status(200).json(invitation);
    });
}
// 프로젝트 멤버 초대
function inviteMember(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId } = req.params;
        const { email } = req.body;
        const invitationId = yield project_service_1.default.inviteMember(Number(projectId), email);
        console.log(`프로젝트${projectId}에서 ${email}로 초대 코드를 전송하였습니다`);
        res.status(201).json(invitationId);
        // 프론트엔드 시연에서 이메일 치고 초대하므로, req.body에서 email을 받아 이것으로 userId를 찾는 것으로 함
        // invitationId라는 것을 만들어 초대 코드로 res로 보냄
    });
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
