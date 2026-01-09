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
exports.oAuthRepo = exports.OAuthRepository = void 0;
const prismaClient_1 = require("../lib/prismaClient");
const token_1 = require("../lib/token");
const crypto_token_1 = require("../lib/crypto.token");
//구글 유저 정보 업서트
class OAuthRepository {
    upsertGoogleAccount(tx_1, _a) {
        return __awaiter(this, arguments, void 0, function* (tx, { email, name, profileImage, providerAccountId, googleRefreshToken, scopes }) {
            const user = yield tx.user.upsert({
                where: { email },
                update: {
                    name: name !== null && name !== void 0 ? name : undefined,
                    profileImage: profileImage !== null && profileImage !== void 0 ? profileImage : undefined
                },
                create: {
                    email,
                    name,
                    profileImage,
                    passwordHashed: null
                }
            });
            yield tx.oAuthAccount.upsert({
                where: {
                    provider_providerAccountId: {
                        provider: 'GOOGLE',
                        providerAccountId
                    }
                },
                update: {
                    userId: user.id,
                    refreshTokenEnc: googleRefreshToken ? (0, crypto_token_1.encryptToken)(googleRefreshToken) : undefined,
                    scope: scopes !== null && scopes !== void 0 ? scopes : []
                },
                create: {
                    provider: 'GOOGLE',
                    providerAccountId,
                    refreshTokenEnc: googleRefreshToken ? (0, crypto_token_1.encryptToken)(googleRefreshToken) : null,
                    scope: scopes !== null && scopes !== void 0 ? scopes : [],
                    userId: user.id
                }
            });
            return user;
        });
    }
    //구글 유저 세션 업서트
    googleUpsertSession(tx_1, _a) {
        return __awaiter(this, arguments, void 0, function* (tx, { userId, deviceIdHash }) {
            const accessToken = (0, token_1.generateAccessToken)(userId);
            const refreshToken = (0, token_1.generateRefreshToken)(userId);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            yield tx.session.upsert({
                where: { userId_deviceIdHash: { userId, deviceIdHash } },
                update: {
                    refreshTokenHash: (0, token_1.sha256)(refreshToken),
                    expiresAt,
                    revokedAt: null
                },
                create: {
                    userId,
                    deviceIdHash,
                    refreshTokenHash: (0, token_1.sha256)(refreshToken),
                    expiresAt,
                    revokedAt: null
                }
            });
            return { accessToken, refreshToken };
        });
    }
    findGoogleToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prismaClient_1.prisma.oAuthAccount.findFirst({
                where: { userId, provider: 'GOOGLE' },
                select: { refreshTokenEnc: true }
            });
        });
    }
}
exports.OAuthRepository = OAuthRepository;
exports.oAuthRepo = new OAuthRepository();
