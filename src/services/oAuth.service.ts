import { prisma } from '../lib/prismaClient';
import bcrypt from 'bcrypt';
import { oAuthRepo } from '../repositories/oAuth.repo';
import { userRepo } from '../repositories/user.repo';
import { sessionRepo } from '../repositories/session.repo';
import {
  generateAccessToken,
  generateRefreshToken,
  sha256,
  verifyRefreshToken
} from '../lib/token';
import {
  decodeOAuthState,
  getGoogleProfile,
  getGoogleToken,
  stripPassword
} from '../lib/utils/oAuth';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} from '../middlewares/errors/customError';
import {
  BuildGoogleAuthUrlInput,
  GoogleCallbackInput,
  RefreshJwtPayload,
  RefreshTokensInput,
  SessionTokens,
  Tx
} from '../types/oAuth';
import { LoginInput, RegisterInput } from '../types/user';
import { User } from '@prisma/client';

export class OAuthService {
  //구글 로그인
  buildGoogleAuthUrl({ redirectTo, deviceId }: BuildGoogleAuthUrlInput): string {
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
    const state = Buffer.from(
      JSON.stringify({
        redirectTo: redirectTo || process.env.FRONTEND_REDIRECT_URI || 'http://localhost:3000',
        deviceId,
        t: Date.now()
      })
    ).toString('base64url');
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
  async googleCallback({
    code,
    state
  }: GoogleCallbackInput): Promise<{ redirectTo: string | undefined } & SessionTokens> {
    if (!code) throw new BadRequestError('잘못된 요청입니다');
    const { redirectTo, deviceId } = decodeOAuthState(state);
    if (!deviceId || typeof deviceId !== 'string') {
      throw new BadRequestError('deviceId가 필요합니다. 다시 로그인 해주세요.');
    }
    const deviceIdHash = sha256(deviceId);
    const { googleAccessToken, googleRefreshToken, scopeStr } = await getGoogleToken(code);
    const profile = await getGoogleProfile(googleAccessToken);
    const providerAccountId = profile.sub;
    const email = profile.email;
    const name = profile.name || 'Google User';
    const profileImage = profile.picture || null;
    if (!email) {
      throw new BadRequestError('잘못된 요청입니다');
    }
    const scopes = String(scopeStr).split(' ').filter(Boolean);
    const tokens = await prisma.$transaction(async (tx: Tx) => {
      const user = await oAuthRepo.upsertGoogleAccount(tx, {
        email,
        name,
        profileImage,
        providerAccountId,
        googleRefreshToken,
        scopes
      });
      return oAuthRepo.googleUpsertSession(tx, { userId: user.id, deviceIdHash });
    });
    return { redirectTo, ...tokens };
  }

  //회원가입
  async register({
    name,
    email,
    password,
    profileImage
  }: RegisterInput): Promise<Omit<User, 'passwordHashed'>> {
    const findEmail = await userRepo.findByUserEmail(email);
    if (findEmail) {
      throw new BadRequestError('이미 가입한 이메일입니다');
    }
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await userRepo.createUser({ name, email, passwordHashed, profileImage });
    return stripPassword(user);
  }

  //로그인
  async login({ email, password, deviceIdHash }: LoginInput): Promise<SessionTokens> {
    const user = await userRepo.findByUserEmail(email);
    if (!user || !user.passwordHashed) {
      throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
    }
    const passwordValid = await bcrypt.compare(password, user.passwordHashed);
    if (!passwordValid) {
      throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const refreshTokenHash = sha256(refreshToken);
    await sessionRepo.upsertSession({
      userId: user.id,
      deviceIdHash,
      refreshTokenHash,
      expiresAt
    });
    return { accessToken, refreshToken };
  }

  //리프레시
  async refreshTokens(input: RefreshTokensInput): Promise<SessionTokens> {
    const { refreshToken, deviceIdHash } = input;
    const payload = verifyRefreshToken(refreshToken) as RefreshJwtPayload;
    const userId = payload?.userId;
    if (!userId) throw new UnauthorizedError('토큰 만료');
    const now = new Date();
    const oldHash = sha256(refreshToken);
    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);
    const newHash = sha256(newRefreshToken);
    const newExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const result = await prisma.$transaction(async (tx: Tx) => {
      const updated = await sessionRepo.rotateSession(
        { userId, deviceIdHash, oldHash, newHash, newExpiresAt, now },
        tx
      );
      if (updated.count !== 1) {
        await sessionRepo.revokeSessions({ userId, deviceIdHash, now }, tx);
        return { status: 'RELOGIN' };
      }
      return { status: 'OK' };
    });
    if (result.status === 'RELOGIN') {
      throw new UnauthorizedError('재로그인이 필요합니다');
    }
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

export const oAuthService = new OAuthService();
