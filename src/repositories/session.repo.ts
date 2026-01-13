import { Prisma, Session } from '@prisma/client';
import { prisma } from '../lib/prismaClient';
import { Tx } from '../types/oAuth';
import { RevokeSessionsInput, RotateSessionInput, UpsertSessionInput } from '../types/session';

export class SessionRepository {
  async upsertSession(input: UpsertSessionInput, tx?: Tx): Promise<Session> {
    const { userId, deviceIdHash, refreshTokenHash, expiresAt } = input;
    const db = tx ?? prisma;
    return db.session.upsert({
      where: { userId_deviceIdHash: { userId, deviceIdHash } },
      update: {
        refreshTokenHash,
        expiresAt,
        revokedAt: null
      },
      create: {
        userId,
        deviceIdHash,
        refreshTokenHash,
        expiresAt,
        revokedAt: null
      }
    });
  }
  //BatchPayload는 Prisma에서 여러 레코드를 한꺼번에 처리하는 메서드(updateMany, deleteMany)를 실행했을 때 돌려받는 결과값의 타입
  rotateSession(input: RotateSessionInput, tx?: Tx): Promise<Prisma.BatchPayload> {
    const { userId, deviceIdHash, oldHash, newHash, newExpiresAt, now } = input;
    const db = tx ?? prisma;
    return db.session.updateMany({
      where: {
        userId,
        deviceIdHash,
        refreshTokenHash: oldHash,
        revokedAt: null,
        expiresAt: { gt: now }
      },
      data: {
        refreshTokenHash: newHash,
        expiresAt: newExpiresAt,
        revokedAt: null,
        updatedAt: now
      }
    });
  }

  revokeSessions(input: RevokeSessionsInput, tx?: Tx): Promise<Prisma.BatchPayload> {
    const { userId, deviceIdHash, now } = input;
    const db = tx ?? prisma;
    return db.session.updateMany({
      where: { userId, deviceIdHash, revokedAt: null },
      data: { revokedAt: now, updatedAt: now }
    });
  }
}

export const sessionRepo = new SessionRepository();
