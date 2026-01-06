import { prisma } from '../lib/prismaClient.js';

export class SessionRepository {
  async upsertSession({ userId, deviceIdHash, refreshTokenHash, expiresAt }) {
    return prisma.session.upsert({
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

  rotateSession({ userId, deviceIdHash, oldHash, newHash, newExpiresAt, now }) {
    return prisma.session.updateMany({
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

  revokeSessions({ userId, deviceIdHash, now }) {
    return prisma.session.updateMany({
      where: { userId, deviceIdHash, revokedAt: null },
      data: { revokedAt: now, updatedAt: now }
    });
  }
}

export const sessionRepo = new SessionRepository();
