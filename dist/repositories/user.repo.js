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
exports.userRepo = exports.UserRepository = void 0;
const prismaClient_1 = require("../lib/prismaClient");
class UserRepository {
    findByUserEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.user.findUnique({
                where: { email }
            });
        });
    }
    createUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, passwordHashed, profileImage }) {
            return prismaClient_1.prisma.user.create({
                data: { name, email, passwordHashed, profileImage }
            });
        });
    }
    update(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.user.update({
                where: { id: userId },
                data,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profileImage: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
        });
    }
    // 일단은 컨벤션 맞추기 전에 유저 레포에 두기. 맞추면 프로젝트레포로 이동
    // 내가 owner 이거나, projectMembers에 내가 있으면 "내 프로젝트"
    countMyProjects(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.project.count({
                where: { OR: [{ ownerId: userId }, { projectMembers: { some: { memberId: userId } } }] }
            });
        });
    }
    findMyProjects(userId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skip, take, orderBy } = args;
            return prismaClient_1.prisma.project.findMany({
                where: { OR: [{ ownerId: userId }, { projectMembers: { some: { memberId: userId } } }] },
                orderBy,
                skip,
                take,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: { select: { projectMembers: true } }
                }
            });
        });
    }
    //마찬가지로 테스크로 이동
    countTasks(projectIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.task.groupBy({
                by: ['projectId', 'status'],
                where: { projectId: { in: projectIds } },
                _count: { _all: true }
            }); //count는 계산해서 만들어내는 복잡한 제네릭 조건부 타입이라 반환부 타입과 완벽히 동일하다고 확신 못할 때가 많음.
            //그런데 number로 고정해놓아서 prisma가 만드는 타입이 복잡해서 지금 맥락에서는 확정하지 못한다고 함.
        });
    }
    getMyProjectIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [members, owners] = yield Promise.all([
                prismaClient_1.prisma.projectMember.findMany({
                    where: { memberId: userId },
                    select: { projectId: true }
                }),
                prismaClient_1.prisma.project.findMany({
                    where: { ownerId: userId },
                    select: { id: true }
                })
            ]);
            return Array.from(new Set([...members.map((r) => r.projectId), ...owners.map((r) => r.id)]));
            // [...members.map(r => r.projectId), ...owners.map(r => r.id)]
            // => [1, 3, 5, 2, 5] 여기서 set은 중복 허용하지 않으니까 [1,3,5,2]가 됨
            //new Set([members.map(...), owners.map(...)])
            //new Set([[1,3,5], [2,5]]) 스프레드 문법 이 아니면 이렇게 됨
        });
    }
    findMyTasks(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.task.findMany({
                where,
                orderBy: [{ startDate: 'asc' }, { id: 'asc' }],
                select: {
                    id: true,
                    projectId: true,
                    title: true,
                    startDate: true,
                    endDate: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    assigneeProjectMember: {
                        select: {
                            member: { select: { id: true, name: true, email: true, profileImage: true } }
                        }
                    },
                    taskTags: {
                        select: {
                            tag: { select: { id: true, name: true } }
                        }
                    },
                    attachments: { select: { url: true } }
                }
            });
        });
    }
}
exports.UserRepository = UserRepository;
exports.userRepo = new UserRepository();
