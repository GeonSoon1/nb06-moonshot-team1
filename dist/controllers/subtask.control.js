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
const subtask_service_1 = __importDefault(require("../services/subtask.service")); // .js 필수
const subtask_struct_1 = require("../structs/subtask.struct");
function getSubTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { subTaskId } = req.params;
        const subTask = yield subtask_service_1.default.getSubTask(Number(subTaskId));
        res.status(200).json(subTask);
    });
}
// 3. 수정
function updateSubTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { subTaskId } = req.params;
        const { title, status } = req.body;
        const subtaskData = {
            title: title !== null && title !== void 0 ? title : undefined,
            status: status !== null && status !== void 0 ? status : undefined
        };
        (0, superstruct_1.assert)(subtaskData, subtask_struct_1.PatchSubTask);
        const updatedSubTask = yield subtask_service_1.default.updateSubTask(Number(subTaskId), subtaskData);
        res.status(200).json(updatedSubTask);
    });
}
// 4. 삭제
function deleteSubTask(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { subTaskId } = req.params;
        yield subtask_service_1.default.deleteSubTask(Number(subTaskId));
        res.status(204).json(null);
    });
}
exports.default = {
    getSubTask,
    updateSubTask,
    deleteSubTask
};
