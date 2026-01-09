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
const prismaClient_1 = require("../lib/prismaClient"); // 본인 환경에 맞게 유지
// 2. 하위 할 일 목록 조회 (특정 Task에 속한 것들)
function findSubTasksByTaskId(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.subTask.findMany({ where: { taskId: id } });
    });
}
// 3. 하위 할 일 단건 조회 (수정/삭제 전 확인용)
function findSubTaskById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.subTask.findUniqueOrThrow({
            where: { id }
        });
    });
}
// 4. 하위 할 일 수정
function updateSubTask(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prisma.subTask.update({
            where: { id },
            data
        });
    });
}
// 5. 하위 할 일 삭제
function deleteSubTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prisma.subTask.delete({
            where: { id }
        });
    });
}
// [중요] 이렇게 내보내야 Service에서 subTaskRepo.createSubTask 처럼 씁니다.
exports.default = {
    findSubTasksByTaskId,
    findSubTaskById,
    updateSubTask,
    deleteSubTask
};
