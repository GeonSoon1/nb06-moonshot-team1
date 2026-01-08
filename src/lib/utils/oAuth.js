import { BadRequestError } from '../../middlewares/errors/customError.js';

export function decodeOAuthState(state) {
  const fallback = process.env.FRONTEND_OAUTH_REDIRECT_URL;
  let redirectTo = fallback;
  let deviceId = null;
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

export async function getGoogleToken(code) {
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

export async function getGoogleProfile(googleAccessToken) {
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

export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie('access-token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 60 * 1000,
    path: '/'
  });
  res.cookie('refresh-token', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
}

export function stripPassword(user) {
  const { passwordHashed: _passwordHashed, ...rest } = user;
  return rest;
}
