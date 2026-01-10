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
exports.sessionRepo = exports.SessionRepository = void 0;
const prismaClient_1 = require("../lib/prismaClient");
class SessionRepository {
    upsertSession(input, tx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, deviceIdHash, refreshTokenHash, expiresAt } = input;
            const db = tx !== null && tx !== void 0 ? tx : prismaClient_1.prisma;
            return db.session.upsert({
                where: { userId_deviceIdHash: { userId, deviceIdHash } },
                update: {
                    refreshTokenHash,
                    expiresAt,
                    revokedAt: null
                },
                create: {
                    userId,
                    deviceIdHash,
                    refreshTokenHash,
                    expiresAt,
                    revokedAt: null
                }
            });
        });
    }
    //BatchPayload는 Prisma에서 여러 레코드를 한꺼번에 처리하는 메서드(updateMany, deleteMany)를 실행했을 때 돌려받는 결과값의 타입
    rotateSession(input, tx) {
        const { userId, deviceIdHash, oldHash, newHash, newExpiresAt, now } = input;
        const db = tx !== null && tx !== void 0 ? tx : prismaClient_1.prisma;
        return db.session.updateMany({
            where: {
                userId,
                deviceIdHash,
                refreshTokenHash: oldHash,
                revokedAt: null,
                expiresAt: { gt: now }
            },
            data: {
                refreshTokenHash: newHash,
                expiresAt: newExpiresAt,
                revokedAt: null,
                updatedAt: now
            }
        });
    }
    revokeSessions(input, tx) {
        const { userId, deviceIdHash, now } = input;
        const db = tx !== null && tx !== void 0 ? tx : prismaClient_1.prisma;
        return db.session.updateMany({
            where: { userId, deviceIdHash, revokedAt: null },
            data: { revokedAt: now, updatedAt: now }
        });
    }
}
exports.SessionRepository = SessionRepository;
exports.sessionRepo = new SessionRepository();
