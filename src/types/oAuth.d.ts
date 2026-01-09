import { Prisma } from '@prisma/client';

type Tx = Prisma.TransactionClient;

type UpsertGoogleAccountInput = {
  email: string;
  name: string;
  profileImage: string | null;
  providerAccountId: string;
  googleRefreshToken?: string | null;
  scopes?: string[];
};

type GoogleUpsertSessionInput = {
  userId: number;
  deviceIdHash: string;
};

type SessionTokens = {
  accessToken: string;
  refreshToken: string;
};

type GoogleRefreshTokenRow = {
  refreshTokenEnc: string | null;
};
//-----------------서비스 단---------------------

type BuildGoogleAuthUrlInput = {
  redirectTo?: string | null;
  deviceId: string;
};

type GoogleCallbackInput = {
  code: string | string[] | undefined;
  state?: string | string[] | undefined;
};

type RefreshTokensInput = {
  refreshToken: string;
  deviceIdHash: string;
};

type RefreshJwtPayload = {
  userId: number;
};

//-------------------유틸 오어스--------------------

type GoogleTokenResult = {
  googleAccessToken: string;
  // refresh_token은 매번 안 올 수 있음(이미 consent 했거나 include_granted_scopes 등 상황)
  googleRefreshToken?: string;
  scopeStr: string;
};

type GoogleProfile = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
};

//--------------------유틸 캘린더--------------------

type SyncTask = {
  id: number;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  googleEventId: string | null;
};

//캐시
type CachedGoogleAccessToken = {
  token: string;
  expiresAtMs: number; // 참고용(디버깅/로그용)
};
