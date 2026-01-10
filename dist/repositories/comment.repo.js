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
function findCommentById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.comment.findUnique({
            where: { id }
        });
    });
}
function updateComment(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.comment.update({
            where: { id },
            data,
            include: { author: { include: { member: true } } } // util에서 member 필요해서 이중 include
        });
    });
}
function deleteComment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.comment.delete({ where: { id } });
    });
}
exports.default = {
    findCommentById,
    updateComment,
    deleteComment
};
