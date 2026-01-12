import { Response } from 'express';
import { BadRequestError } from '../../middlewares/errors/customError';
import { GoogleProfile, GoogleTokenResult, SessionTokens } from '../../types/oAuth';
import { QueryParam } from '../../types/session';

export function decodeOAuthState(state: unknown): {
  redirectTo: string | undefined;
  deviceId: string | null;
} {
  const fallback = process.env.FRONTEND_OAUTH_REDIRECT_URL;
  let redirectTo = fallback;
  let deviceId: string | null = null;
  const raw = state;
  if (!raw || typeof raw !== 'string') return { redirectTo, deviceId };
  try {
    const decoded = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'));
    if (typeof decoded?.redirectTo === 'string') redirectTo = decoded.redirectTo;
    if (typeof decoded?.deviceId === 'string') deviceId = decoded.deviceId;
  } catch (err) {
    console.warn('state 파싱 실패', { err: String(err) });
  }
  return { redirectTo, deviceId };
}

export async function getGoogleToken(code: string | string[]): Promise<GoogleTokenResult> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error();
  }
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: String(code),
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });
  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok) {
    console.error('Google token error:', tokenJson);
    throw new BadRequestError('잘못된 요청입니다');
  }
  return {
    googleAccessToken: tokenJson.access_token,
    googleRefreshToken: tokenJson.refresh_token,
    scopeStr: tokenJson.scope || ''
  };
}

export async function getGoogleProfile(googleAccessToken: string): Promise<GoogleProfile> {
  const userinfoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${googleAccessToken}` }
  });
  const profile = await userinfoRes.json();
  if (!userinfoRes.ok) {
    console.error('Google userinfo error:', profile);
    throw new BadRequestError('잘못된 요청입니다');
  }
  return profile;
}

export function setAuthCookies(res: Response, { accessToken, refreshToken }: SessionTokens) {
  res.cookie('access-token', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 30 * 60 * 1000,
    path: '/'
  });

  res.cookie('refresh-token', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
}

// 제네릭 활용한 타입선언...이렇게도 할 수 있구나
export function stripPassword<T extends { passwordHashed?: unknown }>(user: T): Omit<T, 'passwordHashed'> {
  const { passwordHashed: _passwordHashed, ...rest } = user;
  return rest;
}

export function firstQuery(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return typeof v[0] === 'string' ? v[0] : undefined;
  return undefined;
}

export function requireQuery(value: QueryParam, name: string): string {
  const v = Array.isArray(value) ? value[0] : value;
  // qs가 객체로 파싱한 케이스(ParsedQs)는 문자열로 쓸 수 없으니 거절
  if (typeof v !== 'string' || v.trim() === '') {
    throw new BadRequestError(`${name}가 필요합니다`);
  }

  return v;
}
