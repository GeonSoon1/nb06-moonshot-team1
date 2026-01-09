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
function getProjectList() {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.project.findMany({
            include: { projectMembers: true, tasks: true }
        });
    });
}
function countProjects(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.project.count({ where: { ownerId: userId } });
    });
}
function createProject(name, description, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.project.create({
            data: {
                name,
                description,
                ownerId: userId
            }
        });
    });
}
function updateProject(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.project.update({
            where: { id },
            data,
            include: {
                projectMembers: true,
                tasks: true
            }
        });
    });
}
function deleteProject(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield prismaClient_1.prisma.project.delete({
            where: { id }
        });
    });
}
function findProjectById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return prismaClient_1.prisma.project.findUniqueOrThrow({
            where: { id },
            include: {
                projectMembers: true,
                tasks: true
            }
        });
    });
}
function findMemberByIds(projectId, memberId) {
    return prismaClient_1.prisma.projectMember.findUnique({
        where: { projectId_memberId: { projectId, memberId } }
    });
}
function deleteMember(projectId, memberId) {
    return prismaClient_1.prisma.projectMember.delete({
        where: { projectId_memberId: { projectId, memberId } }
    });
}
function createMember(data) {
    return prismaClient_1.prisma.projectMember.create({ data });
}
function findById(id) {
    return prismaClient_1.prisma.project.findUnique({
        where: { id },
        include: { owner: true }
    });
}
exports.default = {
    getProjectList,
    createProject,
    countProjects,
    findProjectById,
    updateProject,
    deleteProject,
    findMemberByIds,
    deleteMember,
    createMember,
    findById
};
