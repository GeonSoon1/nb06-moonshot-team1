import { prisma } from '../lib/prismaClient.js';
import { encryptToken } from '../lib/crypto.token.js';
import bcrypt from 'bcrypt';
import { CreateUserBodyStruct, LoginUserBodyStruct } from '../structs/oAuth.structs.js';
import { create, StructError } from 'superstruct';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} from '../middlewares/errors/customError.js';
import { Prisma } from '@prisma/client';
import {
  sha256,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../lib/token.js';

// Oauth 워크플로우를 생각하며 혹은 브라우저로 띄워놓고 로직을 보면 이해하는데 도움이 됨
// refreshToken은 DB에 원문 저장 X → sha256 해시로 저장

// 구글 Authorization URL 만들기
function buildGoogleAuthUrl({ redirectTo }) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI; // 예: http://localhost:3001/auth/google/callback
  if (!clientId || !redirectUri) {
    throw new Error('구글 클라이언트 아이디와 리다이렉트 URI를 확인해주세요');
  }
  const scope = [
    'openid',
    'email',
    'profile'
    // 나중에 캘린더 연동할 거면 아래 추가
    // 'https://www.googleapis.com/auth/calendar',
  ].join(' ');
  // state는 서명이라고 생각하면 됨
  // state에 프론트 리다이렉트 목적지를 넣어둠(서버 저장 없이도 가능하게 단순화)
  // 실무에선 state 검증을 더 강하게(서명/저장) 하는 게 좋음
  // state는 문자열 이어야 하니까 객체를 문자로
  const state = Buffer.from(
    JSON.stringify({
      redirectTo: redirectTo || process.env.FRONTEND_OAUTH_REDIRECT_URL || 'http://localhost:3000',
      t: Date.now()
    })
  ).toString('base64url');
  //t: Date.now() 나중에 너무 오래된 state면 거절 같은 검증에 쓰거나 디버깅에 도움됨
  //콜백에서 디코딩 const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline', //online(기본): 보통 access token만 받고 끝, offline: refresh token을 함께 받을 수 있게 요청
    prompt: 'consent', //동의 화면을 매번 띄우기, 이전에 동의했던 유저라도 매번 보여줌
    include_granted_scopes: 'true',
    // 나중에 추가 권한이 필요할 때(예: 처음엔 openid email profile만, 나중에 캘린더 scope 추가)
    // include_granted_scopes=true로 다시 인증 요청을 보내면,
    // 새 토큰이 기존에 승인됐던 scope + 새로 승인된 scope를 합친 범위로 나오게 해줌.
    state
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// 1) /auth/google  (브라우저에서 눌렀을 때 구글 로그인으로 보내기)
export async function googleAuth(req, res) {
  // 프론트에서 “로그인 끝나고 돌아갈 주소”를 넘기고 싶으면:
  // /auth/google?redirectTo=http://localhost:3000/oauth/callback
  const redirectTo = req.query.redirectTo;
  const url = buildGoogleAuthUrl({ redirectTo });
  return res.redirect(307, url);
}

// 2) /auth/google/callback (구글이 code를 들고 되돌아옴)
export async function googleCallback(req, res) {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) throw new BadRequestError('잘못된 요청입니다');

  // state에서 프론트 복귀 주소 파싱
  let redirectTo = process.env.FRONTEND_OAUTH_REDIRECT_URL || 'http://localhost:3000';
  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
      if (decoded?.redirectTo) redirectTo = decoded.redirectTo;
    } catch (err) {
      console.warn('state 파싱 실패', {
        err: String(err),
        ip: req.ip
      });
      // 에러 스로우나 리턴 안하고 넘기고, 일단 로그로 기록 남기기..
    }
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('구글 환경 변수를 확인해 주세요');
  }

  // 1) code → 구글 토큰 교환
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

  const googleAccessToken = tokenJson.access_token;
  const googleRefreshToken = tokenJson.refresh_token;
  // const expiresInSec = tokenJson.expires_in;
  const scopeStr = tokenJson.scope || '';

  // 2) 구글 사용자 정보 가져오기
  const userinfoRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${googleAccessToken}` }
  });
  const profile = await userinfoRes.json();
  //   const decoded = jwt.decode(tokenJson.id_token);
  //   console.log(decoded);
  // id token에서 디코딩해서 유저정보 빼와도 됨 그럼 , 위의 await을 생략할 수 있음
  // 대신 토큰 검증 필요, decode는 그냥 payload 펼쳐보는 것

  // 여기서 헷갈리는 것. 이미 시크릿 키로 구글에서 받아온 토큰인데 다시 검증할 필요가 있나?
  // “받았다”는 것만으로는 검증된 게 아니고, 우리 서버가 직접 검증(verify)해야 함.
  // 지금 내 코드는 id_token을 “발급받긴” 하지만, 서명/클레임 검증 로직을 따로 하고 있진 않음.
  // 왜 “이미 검증된 거 아닌가”하고 느끼는지
  // /token 엔드포인트에서 code + client_secret까지 써서 토큰을 받았고
  // “구글이 준 거니까 신뢰해도 되지 않나?”라는 생각
  // 하지만 OAuth/OpenID Connect에서 “id_token 신뢰”는 ‘내가 직접 검증했다’가 기준.

  if (!userinfoRes.ok) {
    console.error('Google userinfo error:', profile);
    throw new BadRequestError('잘못된 요청입니다');
  }

  const providerAccountId = profile.sub; // 구글 고유 id
  const email = profile.email;
  const name = profile.name || 'Google User';
  const profileImage = profile.picture || null;
  const emailVerified = profile.email_verified;

  if (!email || emailVerified === false) {
    throw new BadRequestError('잘못된 요청입니다');
  }

  const provider = 'GOOGLE';
  const scopes = scopeStr.split(' ').filter(Boolean);

  // 3) 우리 서비스 유저/계정 upsert + 우리 refresh 세션 생성 (트랜잭션)
  const { accessToken, refreshToken } = await prisma.$transaction(async (tx) => {
    // (A) 유저: email 기준으로 연결(이미 가입한 이메일이면 같은 계정에 구글 연결)
    const user = await tx.user.upsert({
      where: { email },
      update: {
        // 기존값이 있으면 유지하고 없으면 채우는 느낌으로
        name: name ?? undefined,
        profileImage: profileImage ?? undefined
      },
      create: {
        email,
        name,
        profileImage,
        passwordHashed: null // 소셜 로그인이라 비번 없음
      }
    });

    // OAuthAccount: provider + providerAccountId로 유니크
    // 아래 where 키 이름은 Prisma가 생성한 compound unique 키 형태라
    // schema에 @@unique([provider, providerAccountId])가 있으면 provider_providerAccountId
    await tx.oAuthAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId
        }
      },
      update: {
        userId: user.id,
        refreshTokenEnc: googleRefreshToken ? encryptToken(googleRefreshToken) : undefined, // 없으면 기존 유지 // 복호화 가능한 암호화 해서 넣어야함
        scope: scopes ?? []
      },
      create: {
        provider,
        providerAccountId,
        refreshTokenEnc: googleRefreshToken ? encryptToken(googleRefreshToken) : null, //복호화 가능한 암호화 해서 넣어야함
        scope: scopes ?? [],
        userId: user.id
      }
    });

    // (C) 우리 서비스 토큰 발급 + 세션 저장
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await tx.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revokedAt: null
      }
    });

    return { accessToken, refreshToken };
  });

  // 4) 프론트로 토큰 전달
  res.cookie('access-token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 60 * 1000, // 30m
    path: '/'
  });

  res.cookie('refresh-token', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
    path: '/' //경로 refresh api로 제한은 쿠키 기반으로 사용할 때 설정해야함 /refresh를 bearer 헤더로 보내는 스펙이라 path제한이랑 충돌생김.
  });

  return res.redirect(307, `${redirectTo}/projects`);
}

// 그럼 access-token 쿠키는 “없어도 되는데”, 왜 너희는 필요해 보이냐?
// 너희 프론트 코드 흐름이 대충 이렇잖아:
// 로그인 여부 판단 / API 호출할 때 getAccessToken()으로 access-token 쿠키를 읽음
// accessToken 없으면 Authorization을 못 달아서 /users/me/...가 실패
// 실패하면 로그인 화면으로 보내는 로직이 있음
// 즉, “access-token이 없으면 refresh를 먼저 돌려서 access-token을 만들자” 라는 자동 부트스트랩 로직이 프론트에 기본으로 깔려있지 않으면, access-token 쿠키가 사실상 필요해져.
// 그래서 해결은 둘 중 하나야:
// 선택 A (가장 쉬움, 추천)
// OAuth 콜백에서 access-token + refresh-token 둘 다 쿠키로 심기
// refresh-token은 path: '/' (일단 단순하게)
// 프론트는 평소처럼 access-token을 써서 요청함

// 4) refresh 갱신은 “프론트가 요청하고”, “서버가 회전(rotate)한다”
// 정확히는 이렇게 역할이 나뉘어:
// 프론트: “access 토큰 만료됨” 상황을 감지하면 /auth/refresh를 호출함
// 서버: refresh 토큰이 유효한지 Session 테이블(해시/만료/폐기)로 검증하고,
// 새 accessToken 발급
// 새 refreshToken 발급(회전)
// DB의 세션을 새 토큰 해시로 업데이트하거나, 새 세션 만들고 이전 세션 revoked 처리
// 응답으로 새 토큰 2개 내려줌
// 프론트: 응답 받은 새 토큰을 쿠키에 다시 저장(setAuthCookies)
//-------------------------------------------------------
// “DB에 저장하지 않고 헤더에 실어 보낸다”는 건 그 토큰이 구글로 전송되면서 ‘소멸’한다는 뜻이 아니야.
// 정확히는 이렇게 이해하면 돼:
// 1) 토큰은 “사라지는” 게 아니라, 네가 안 들고 있으면 잊어버리는 것
// access_token은 문자열이야.
// 네 코드에서 변수를 통해 들고 있다가 요청에 헤더로 붙여서 보내고,
// 그 요청 처리가 끝나면 그 변수를 어디에도 저장 안 했으니(메모리/DB/캐시) 너는 그 값을 다시 꺼낼 방법이 없어져.
// 즉,
// 토큰 자체가 무효/소멸되는 게 아니라
// 네 쪽에서 토큰 값을 더 이상 보관하지 않아서 재사용을 못 하는 것이야.
// 2) 그럼 토큰은 어디 “존재”하냐?
// 토큰의 “유효성”은 구글 서버가 관리해.
// access_token은 보통 발급 후 일정 시간(예: 1시간) 동안 유효하고,
// 그 시간 동안엔 같은 토큰을 계속 Authorization 헤더에 실어서 재사용 가능해.
// 3) 왜 매번 refresh를 치게 되냐?
// 네가 access_token을 DB나 캐시에 저장하지 않으면, 다음 요청 때는:
// “지난번 access_token이 뭐였지?”를 알 길이 없으니까
// refresh_token으로 새 access_token을 다시 발급받게 되는 거야.
// 4) 로그/네트워크에 남나?
// HTTPS라서 전송 중에 “누가” 헤더를 볼 수 있는 건 아니지만,
// 프록시/서버 로그에 Authorization 헤더를 찍어버리면 위험해.
// 그래서 보통 로그에서 Authorization 헤더는 마스킹/제외해.
// 정리하면:
// 헤더로 보내면 토큰이 사라지는 게 아니라, 저장을 안 하면 “네가 재사용할 토큰 값을 잃어버리는” 거고, 토큰은 만료 전까지는 유효해.

//세션 테이블 리프레시 토큰 흐름
// 로그인/소셜 콜백 때
// 서버가 refreshToken(원문)을 발급
// cryptoHash(refreshToken) 해서 나온 해시를 DB에 저장
// Session.refreshTokenHash = <hash>
// 나중에 /auth/refresh 호출될 때
// 클라이언트가 refreshToken 원문을 요청에 보냄
// 서버가 그 원문을 다시 cryptoHash(refreshToken) 함
// DB에서 refreshTokenHash가 그 해시와 같은 row를 찾음
// 즉, 네 말대로
// “로그인할 때 해싱했던 것과 동일한 토큰이 들어왔으니, 같은 해싱함수로 해싱하면 같은 값이 나온다 → 그걸로 찾는다”가 맞아

//회원가입
export async function register(req, res) {
  try {
    const { name, email, password, profileImage } = create(req.body, CreateUserBodyStruct);
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHashed, profileImage }
    });
    const { passwordHashed: _, ...userWithoutPassword } = user;
    return res.status(201).send(userWithoutPassword);
  } catch (err) {
    if (err instanceof StructError) {
      throw new BadRequestError('잘못된 데이터 형식');
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new BadRequestError('이미 가입한 이메일입니다');
    }
    throw err;
  }
}
//로그인
export async function login(req, res) {
  try {
    const { email, password } = create(req.body, LoginUserBodyStruct);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    const passwordValid = await bcrypt.compare(password, user.passwordHashed);
    if (!passwordValid) {
      throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = sha256(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //7일
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        expiresAt,
        revokedAt: null
      }
    });
    return res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    if (err instanceof StructError) {
      throw new BadRequestError();
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
    }
    throw err;
  }
}

//리프레쉬 토큰 : 로테이션 방식 (refresh 토큰 1회용, 사용자가 요청할 때마다 새로운 토큰 발급, 이전 토큰 무효화)
export async function refresh(req, res) {
  const refreshToken = req.refreshToken;

  const payload = verifyRefreshToken(refreshToken);
  const userId = payload.userId;
  if (!userId) throw new UnauthorizedError('토큰 만료');

  const now = new Date();
  const oldHash = sha256(refreshToken);

  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = generateRefreshToken(userId);
  const newHash = sha256(newRefreshToken);
  const newExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const rotated = await prisma.$transaction(async (tx) => {
    const result = await tx.session.updateMany({
      where: {
        userId,
        refreshTokenHash: oldHash,
        revokedAt: null,
        expiresAt: { gt: now } // gt: greater then(~보다 큰) , expiresAt > now = 아직 만료되지 않음
      },
      data: {
        refreshTokenHash: newHash,
        expiresAt: newExpiresAt,
        revokedAt: null,
        updatedAt: now
      }
    });
    // 조건에 맞는 세션이 없다는 건: 이미 만료됨 / revoke됨 / 토큰이 틀림 / 이미 한 번 회전돼서 oldHash가 사라짐
    if (result.count !== 1) return false;
    return true;
  });

  if (!rotated) {
    throw new UnauthorizedError('토큰 만료4');
  }

  return res.status(200).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  });
}
