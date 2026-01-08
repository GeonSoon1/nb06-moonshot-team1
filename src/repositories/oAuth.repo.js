import { encryptToken } from '../lib/crypto.token.js';
import { prisma } from '../lib/prismaClient.js';
import { generateAccessToken, generateRefreshToken, sha256 } from '../lib/token.js';

//구글 유저 정보 업서트
export class OAuthRepository {
  async upsertGoogleAccount(tx, { email, name, profileImage, providerAccountId, googleRefreshToken, scopes }) {
    const user = await tx.user.upsert({
      where: { email },
      update: {
        name: name ?? undefined,
        profileImage: profileImage ?? undefined
      },
      create: {
        email,
        name,
        profileImage,
        passwordHashed: null
      }
    });
    await tx.oAuthAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider: 'GOOGLE',
          providerAccountId
        }
      },
      update: {
        userId: user.id,
        refreshTokenEnc: googleRefreshToken ? encryptToken(googleRefreshToken) : undefined,
        scope: scopes ?? []
      },
      create: {
        provider: 'GOOGLE',
        providerAccountId,
        refreshTokenEnc: googleRefreshToken ? encryptToken(googleRefreshToken) : null,
        scope: scopes ?? [],
        userId: user.id
      }
    });
    return user;
  }
  //구글 유저 세션 업서트
  async googleUpsertSession(tx, { userId, deviceIdHash }) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tx.session.upsert({
      where: { userId_deviceIdHash: { userId, deviceIdHash } },
      update: {
        refreshTokenHash: sha256(refreshToken),
        expiresAt,
        revokedAt: null
      },
      create: {
        userId,
        deviceIdHash,
        refreshTokenHash: sha256(refreshToken),
        expiresAt,
        revokedAt: null
      }
    });
    return { accessToken, refreshToken };
  }
  async findGoogleToken(userId) {
    return prisma.oAuthAccount.findFirst({
      where: { userId, provider: 'GOOGLE' },
      select: { refreshTokenEnc: true }
    });
  }
}

export const oAuthRepo = new OAuthRepository();
