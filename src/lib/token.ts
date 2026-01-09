import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../middlewares/errors/customError.js';
import crypto from 'crypto';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constants.js';
import { AccessTokenPayload, RefreshTokenPayload } from '../types/session.js';

export function generateAccessToken(userId: number): string {
  if (!ACCESS_TOKEN_SECRET) throw new Error('Missing ACCESS_TOKEN_SECRET');
  try {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' }); //30m
  } catch (error) {
    throw new Error('Access 토큰 생성 실패');
  }
}

export function generateRefreshToken(userId: number): string {
  if (!REFRESH_TOKEN_SECRET) throw new Error('Missing REFRESH_TOKEN_SECRET');
  try {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  } catch (error) {
    throw new Error('Refresh 토큰 생성 실패');
  }
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  if (!ACCESS_TOKEN_SECRET) throw new Error('Missing ACCESS_TOKEN_SECRET');
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    // decoded: string | JwtPayload 이라서 직접 가드
    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof (decoded as JwtPayload).userId !== 'number'
    ) {
      throw new UnauthorizedError('Access 토큰 검증 실패');
    }
    return decoded as AccessTokenPayload;
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Access 토큰이 만료되었습니다');
    }
    throw new UnauthorizedError('Access 토큰 검증 실패');
  }
}
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  if (!REFRESH_TOKEN_SECRET) throw new Error('Missing REFRESH_TOKEN_SECRET');
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof (decoded as JwtPayload).userId !== 'number'
    ) {
      throw new UnauthorizedError('Refresh 토큰 검증 실패');
    }
    return decoded as RefreshTokenPayload;
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh 토큰이 만료되었습니다');
    }
    throw new UnauthorizedError('Refresh 토큰 검증 실패');
  }
}

export function sha256(input: string | Buffer): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
