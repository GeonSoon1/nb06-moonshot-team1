"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../middlewares/asyncHandler");
const refreshToken_1 = require("../middlewares/refreshToken");
const oAuth_control_1 = require("../controllers/oAuth.control");
const device_1 = require("../middlewares/device");
const authRouter = express_1.default.Router();
authRouter.post('/register', (0, asyncHandler_1.asyncHandler)(oAuth_control_1.register));
authRouter.post('/login', device_1.requireDevice, (0, asyncHandler_1.asyncHandler)(oAuth_control_1.login));
authRouter.post('/refresh', device_1.requireDevice, refreshToken_1.requireRefresh, (0, asyncHandler_1.asyncHandler)(oAuth_control_1.refresh));
authRouter.get('/google', device_1.requireDevice, (0, asyncHandler_1.asyncHandler)(oAuth_control_1.googleAuth));
authRouter.get('/google/callback', (0, asyncHandler_1.asyncHandler)(oAuth_control_1.googleCallback));
exports.default = authRouter;
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [인증]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name, profileImage]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: 등록
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id, email, name, profileImage, createdAt, updatedAt]
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                   format: email
 *                 name:
 *                   type: string
 *                 profileImage:
 *                   type: string
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *           examples:
 *             duplicatedEmail:
 *               summary: 이미 등록된 유저
 *               value:
 *                 message: 이미 가입한 이메일입니다.
 *             invalidFormat:
 *               summary: 잘못된 데이터 형식
 *               value:
 *                 message: 잘못된 데이터 형식
 *
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [인증]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [accessToken, refreshToken]
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: 존재하지 않거나 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [인증]
 *     responses:
 *       200:
 *         description: 토큰 갱신
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [accessToken, refreshToken]
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *           examples:
 *             badRequest:
 *               summary: 잘못된 요청
 *               value:
 *                 message: "잘못된 요청입니다"
 *       401:
 *         description: 토큰 만료
 *         content:
 *           application/json:
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *           examples:
 *             unauthorized:
 *               summary: 토큰 만료
 *               value:
 *                 message: "토큰 만료"
 *
 * /auth/google:
 *   get:
 *     tags: [인증]
 *     security: []
 *     summary: 구글 로그인 (회원가입)
 *     description: |
 *       프론트에서 로그인 버튼 클릭 시 진입.
 *       서버가 Google OAuth 인증 페이지로 307 Redirect.
 *       Swagger UI Try it out으로 정상 로그인 보장하지 않음.
 *     responses:
 *       307:
 *         description: Temporary Redirect to Google OAuth
 *         headers:
 *           Location:
 *             description: Google OAuth authorization endpoint URL
 *             schema:
 *               type: string
 *               example: "https://accounts.google.com/o/oauth2/v2/auth?...&redirect_uri=https://api.example.com/auth/google/callback"
 *
 * /auth/google/callback:
 *   get:
 *     tags: [인증]
 *     security: []
 *     summary: 구글 로그인 콜백
 *     description: |
 *       Google OAuth 인증 이후 호출되는 콜백 엔드포인트.
 *       인증 성공 시 프론트엔드 사이트로 Redirect.
 *       Swagger UI Try it out으로 정상 작동 보장하지 않음.
 *     responses:
 *       307:
 *         description: Temporary Redirect to frontend on successful authentication
 *         headers:
 *           Location:
 *             description: Frontend redirect URL
 *             schema:
 *               type: string
 *               example: "https://frontend.example.com"
 *
 */
