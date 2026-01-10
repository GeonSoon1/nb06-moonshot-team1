import express from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { requireRefresh } from '../middlewares/refreshToken';
import { googleAuth, googleCallback, login, refresh, register } from '../controllers/oAuth.control';
import { requireDevice } from '../middlewares/device';

const authRouter = express.Router();

authRouter.post('/register', asyncHandler(register));
authRouter.post('/login', requireDevice, asyncHandler(login));
authRouter.post('/refresh', requireDevice, requireRefresh, asyncHandler(refresh));
authRouter.get('/google', requireDevice, asyncHandler(googleAuth));
authRouter.get('/google/callback', asyncHandler(googleCallback));

export default authRouter;

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
 *           example:
 *             email: user@test.com
 *             password: password
 *             name: 정코드
 *             profileImage: http://localhost:3000/images/chung.png
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
 *         description: Created
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
 *         description: Bad Request
 *         content:
 *           application/json:
 *             examples:
 *               duplicatedEmail:
 *                 value:
 *                   message: 이미 가입한 이메일입니다.
 *               invalidFormat:
 *                 value:
 *                   message: 잘못된 데이터 형식
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: 로그인
 *     tags:
 *       - 인증
 *     security:
 *       - deviceId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: user1@test.com
 *             password: password1
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               accessToken: xxxxxxxxxxxxxxxxx
 *               refreshToken: xxxxxxxxxxxxxxxxx
 *             schema:
 *               type: object
 *               required: [accessToken, refreshToken]
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: 잘못된 요청입니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: 존재하지 않거나 비밀번호가 일치하지 않습니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: 토큰 갱신
 *     tags: [인증]
 *     security:
 *       - deviceId: []
 *       - refreshToken: []
 *     responses:
 *       200:
 *         description: 토큰 갱신
 *         content:
 *           application/json:
 *             example:
 *               accessToken: xxxxxxxxxxxxxxxxx
 *               refreshToken: xxxxxxxxxxxxxxxxx
 *             schema:
 *               type: object
 *               required: [accessToken, refreshToken]
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             examples:
 *               message: 잘못된 요청입니다
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             examples:
 *               message: 토큰 만료
 *             schema:
 *               required: [message]
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**
 * @openapi
 * /auth/google:
 *   get:
 *     tags: [인증]
 *     security: []
 *     summary: 구글 로그인 (회원가입)
 *     description: |
 *       프론트에서 로그인 버튼 클릭 시 진입.
 *       서버가 Google OAuth 인증 페이지로 307 Redirect.
 *       Swagger UI Try it out으로 정상 로그인 보장하지 않음.
 *     parameters:
 *       - in: header
 *         name: X-Device-Id
 *         required: true
 *         schema:
 *           type: string
 *           default: dev-rest-123
 *         description: 디바이스 식별자
 *     responses:
 *       307:
 *         description: Temporary Redirect
 *         headers:
 *           Location:
 *             description: Google OAuth authorization endpoint URL
 *             schema:
 *               type: string
 *               example: "https://accounts.google.com/o/oauth2/v2/auth?...&redirect_uri=https://api.example.com/auth/google/callback"
 */
/**
 * @openapi
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
 *         description: Temporary Redirect
 *         headers:
 *           Location:
 *             description: Frontend redirect URL
 *             schema:
 *               type: string
 *               example: "https://frontend.example.com"
 *
 */
