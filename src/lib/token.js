import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../middlewares/errors/customError.js';
import crypto from 'crypto';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constants.js';

export function generateAccessToken(userId) {
  try {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
  } catch (error) {
    throw new Error('Access 토큰 생성 실패');
  }
}

export function generateRefreshToken(userId) {
  try {
    return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  } catch (error) {
    throw new Error('Refresh 토큰 생성 실패');
  }
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access 토큰이 만료되었습니다');
    }
    throw new UnauthorizedError('Access 토큰 검증 실패');
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Refresh 토큰이 만료되었습니다');
    }
    throw new UnauthorizedError('Refresh 토큰 검증 실패');
  }
}

export function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}
