import { prisma } from '../lib/prismaClient.js';

export async function cleanupSessions() {
  const now = new Date();
  // revoke된 세션은 14일 보관 후 삭제
  // 유저가 로그아웃 등을 해서 이미 취소된 세션이라도 보안 점검이나 로그 분석을 위해 최소한 14일은 남겨두기 위한 것
  const keepUntil = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000); //현재로부터 14일 전
  const [expiredResult, revokedResult] = await prisma.$transaction([
    prisma.session.deleteMany({
      where: { expiresAt: { lt: now } }
    }),
    prisma.session.deleteMany({
      // 취소된 날짜(revokedAt)가 null이 아니면서(즉, 취소된 상태), 그 날짜가 7일 전(keepUntil)보다 더 과거(lt)인 데이터
      // 로그아웃된 지 일주일 넘은 데이터
      where: {
        revokedAt: { not: null, lt: keepUntil }
      }
    })
  ]);
  return {
    deletedExpired: expiredResult.count, //지워진 만료세션 수
    deletedRevoked: revokedResult.count, //지워진 취소세션 수
    ranAt: now.toISOString() //실행 시각
  };
}
