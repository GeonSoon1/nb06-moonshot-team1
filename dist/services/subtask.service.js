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
const subtask_repo_1 = __importDefault(require("../repositories/subtask.repo")); // .js 필수
// 하위할일 상세조회
function getSubTask(subTaskId) {
    return __awaiter(this, void 0, void 0, function* () {
        const subTask = (yield subtask_repo_1.default.findSubTaskById(subTaskId));
        // if (!subTask) return null;//수정
        const { id, title, taskId, status, createdAt, updatedAt } = subTask;
        return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
    });
}
// 3. 수정
function updateSubTask(subTaskId, subtaskData) {
    return __awaiter(this, void 0, void 0, function* () {
        const subTask = yield subtask_repo_1.default.updateSubTask(subTaskId, subtaskData);
        const { id, title, taskId, status, createdAt, updatedAt } = subTask;
        return { id, title, taskId, status: status.toLowerCase(), createdAt, updatedAt };
    });
}
// 4. 삭제
function deleteSubTask(subTaskId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield subtask_repo_1.default.deleteSubTask(subTaskId);
    });
}
exports.default = {
    getSubTask,
    updateSubTask,
    deleteSubTask
};
