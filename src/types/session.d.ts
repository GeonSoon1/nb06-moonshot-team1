import { JwtPayload } from 'jsonwebtoken';
import type { ParsedQs } from 'qs';

type UpsertSessionInput = {
  userId: number;
  deviceIdHash: string;
  refreshTokenHash: string;
  expiresAt: Date;
};

type RotateSessionInput = {
  userId: number;
  deviceIdHash: string;
  oldHash: string;
  newHash: string;
  newExpiresAt: Date;
  now: Date;
};

type RevokeSessionsInput = {
  userId: number;
  deviceIdHash: string;
  now: Date;
};

type AccessTokenPayload = JwtPayload & { userId: number };

type RefreshTokenPayload = JwtPayload & { userId: number };

type QueryValue = string | string[] | ParsedQs | ParsedQs[] | undefined;

type QueryParam = string | ParsedQs | (string | ParsedQs)[] | undefined;
