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
exports.oAuthService = exports.OAuthService = void 0;
const prismaClient_1 = require("../lib/prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
const oAuth_repo_1 = require("../repositories/oAuth.repo");
const user_repo_1 = require("../repositories/user.repo");
const session_repo_1 = require("../repositories/session.repo");
const token_1 = require("../lib/token");
const oAuth_1 = require("../lib/utils/oAuth");
const customError_1 = require("../middlewares/errors/customError");
class OAuthService {
    //구글 로그인
    buildGoogleAuthUrl({ redirectTo, deviceId }) {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;
        if (!clientId || !redirectUri) {
            throw new Error('구글 클라이언트 아이디와 리다이렉트 URI를 확인해주세요'); //백엔드 역할, 콘솔로 출력되게 warn
        }
        const scope = [
            'openid',
            'email',
            'profile',
            'https://www.googleapis.com/auth/calendar.events'
        ].join(' ');
        const state = Buffer.from(JSON.stringify({
            redirectTo: redirectTo || process.env.FRONTEND_REDIRECT_URI || 'http://localhost:3000',
            deviceId,
            t: Date.now()
        })).toString('base64url');
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope,
            access_type: 'offline',
            prompt: 'consent',
            include_granted_scopes: 'true',
            state
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    //구글 콜백
    //구글 콜백에서 던지는 에러메세지는 우리 서버가 아니라 인가서버에서 보는 것
    //디버깅에 쓰려한다면 console로 찍히도록 할 것
    googleCallback(_a) {
        return __awaiter(this, arguments, void 0, function* ({ code, state }) {
            if (!code)
                throw new customError_1.BadRequestError('잘못된 요청입니다');
            const { redirectTo, deviceId } = (0, oAuth_1.decodeOAuthState)(state);
            if (!deviceId || typeof deviceId !== 'string') {
                throw new customError_1.BadRequestError('deviceId가 필요합니다. 다시 로그인 해주세요.');
            }
            const deviceIdHash = (0, token_1.sha256)(deviceId);
            const { googleAccessToken, googleRefreshToken, scopeStr } = yield (0, oAuth_1.getGoogleToken)(code);
            const profile = yield (0, oAuth_1.getGoogleProfile)(googleAccessToken);
            const providerAccountId = profile.sub;
            const email = profile.email;
            const name = profile.name || 'Google User';
            const profileImage = profile.picture || null;
            if (!email) {
                throw new customError_1.BadRequestError('잘못된 요청입니다');
            }
            const scopes = String(scopeStr).split(' ').filter(Boolean);
            const tokens = yield prismaClient_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const user = yield oAuth_repo_1.oAuthRepo.upsertGoogleAccount(tx, {
                    email,
                    name,
                    profileImage,
                    providerAccountId,
                    googleRefreshToken,
                    scopes
                });
                return oAuth_repo_1.oAuthRepo.googleUpsertSession(tx, { userId: user.id, deviceIdHash });
            }));
            return Object.assign({ redirectTo }, tokens);
        });
    }
    //회원가입
    register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password, profileImage }) {
            const findEmail = yield user_repo_1.userRepo.findByUserEmail(email);
            if (findEmail) {
                throw new customError_1.BadRequestError('이미 가입한 이메일입니다');
            }
            const passwordHashed = yield bcrypt_1.default.hash(password, 10);
            const user = yield user_repo_1.userRepo.createUser({ name, email, passwordHashed, profileImage });
            return (0, oAuth_1.stripPassword)(user);
        });
    }
    //로그인
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, deviceIdHash }) {
            const user = yield user_repo_1.userRepo.findByUserEmail(email);
            if (!user || !user.passwordHashed) {
                throw new customError_1.NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
            }
            const passwordValid = yield bcrypt_1.default.compare(password, user.passwordHashed);
            if (!passwordValid) {
                throw new customError_1.NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
            }
            const accessToken = (0, token_1.generateAccessToken)(user.id);
            const refreshToken = (0, token_1.generateRefreshToken)(user.id);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            const refreshTokenHash = (0, token_1.sha256)(refreshToken);
            yield session_repo_1.sessionRepo.upsertSession({
                userId: user.id,
                deviceIdHash,
                refreshTokenHash,
                expiresAt
            });
            return { accessToken, refreshToken };
        });
    }
    //리프레시
    refreshTokens(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken, deviceIdHash } = input;
            const payload = (0, token_1.verifyRefreshToken)(refreshToken);
            const userId = payload === null || payload === void 0 ? void 0 : payload.userId;
            if (!userId)
                throw new customError_1.UnauthorizedError('토큰 만료');
            const now = new Date();
            const oldHash = (0, token_1.sha256)(refreshToken);
            const newAccessToken = (0, token_1.generateAccessToken)(userId);
            const newRefreshToken = (0, token_1.generateRefreshToken)(userId);
            const newHash = (0, token_1.sha256)(newRefreshToken);
            const newExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const result = yield prismaClient_1.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const updated = yield session_repo_1.sessionRepo.rotateSession({ userId, deviceIdHash, oldHash, newHash, newExpiresAt, now }, tx);
                if (updated.count !== 1) {
                    yield session_repo_1.sessionRepo.revokeSessions({ userId, deviceIdHash, now }, tx);
                    return { status: 'RELOGIN' };
                }
                return { status: 'OK' };
            }));
            if (result.status === 'RELOGIN') {
                throw new customError_1.UnauthorizedError('재로그인이 필요합니다');
            }
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        });
    }
}
exports.OAuthService = OAuthService;
exports.oAuthService = new OAuthService();
