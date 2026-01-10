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
exports.googleAuth = googleAuth;
exports.googleCallback = googleCallback;
exports.register = register;
exports.login = login;
exports.refresh = refresh;
const oAuth_structs_1 = require("../structs/oAuth.structs");
const superstruct_1 = require("superstruct");
const customError_1 = require("../middlewares/errors/customError");
const oAuth_service_1 = require("../services/oAuth.service");
const oAuth_1 = require("../lib/utils/oAuth");
//auth/google  (브라우저에서 눌렀을 때 구글 로그인으로 보내기)
function googleAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const redirectTo = (0, oAuth_1.firstQuery)(req.query.redirectTo);
        const deviceId = req.deviceId;
        if (!deviceId)
            throw new customError_1.BadRequestError('deviceId가 필요합니다');
        const url = oAuth_service_1.oAuthService.buildGoogleAuthUrl({ redirectTo, deviceId });
        return res.redirect(307, url);
    });
}
//구글 콜백
function googleCallback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = (0, oAuth_1.requireQuery)(req.query.code, 'code');
        const state = (0, oAuth_1.requireQuery)(req.query.state, 'state');
        const { accessToken, refreshToken, redirectTo } = yield oAuth_service_1.oAuthService.googleCallback({
            code,
            state
        });
        if (!redirectTo) {
            throw new customError_1.BadRequestError();
        }
        (0, oAuth_1.setAuthCookies)(res, { accessToken, refreshToken });
        return res.redirect(307, redirectTo);
    });
}
//회원가입
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, email, password, profileImage } = (0, superstruct_1.create)(req.body, oAuth_structs_1.CreateUserBodyStruct);
        const userWithoutPassword = yield oAuth_service_1.oAuthService.register({
            name,
            email,
            password,
            profileImage
        });
        return res.status(201).send(userWithoutPassword);
    });
}
//로그인
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = (0, superstruct_1.create)(req.body, oAuth_structs_1.LoginUserBodyStruct);
        const deviceIdHash = req.deviceIdHash;
        if (!deviceIdHash) {
            throw new customError_1.BadRequestError('deviceId가 필요합니다');
        }
        const result = yield oAuth_service_1.oAuthService.login({ email, password, deviceIdHash });
        return res.status(200).json(result);
    });
}
//리프레쉬 토큰 : 로테이션 방식 (refresh 토큰 1회용, 사용자가 요청할 때마다 새로운 토큰 발급, 이전 토큰 무효화)
function refresh(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.refreshToken;
        const deviceIdHash = req.deviceIdHash;
        if (!refreshToken || !deviceIdHash) {
            throw new customError_1.BadRequestError('refreshToken/deviceIdHash가 필요합니다');
        }
        const tokens = yield oAuth_service_1.oAuthService.refreshTokens({ refreshToken, deviceIdHash });
        return res.status(200).json(tokens);
    });
}
