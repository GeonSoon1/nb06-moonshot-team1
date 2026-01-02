import { prisma } from '../lib/prismaClient.js';
import { verifyAccessToken } from '../lib/token.js';
import { UnauthorizedError } from '../middlewares/errors/customError.js';

// 브라우저로부터 넘어온 토큰을 검사하고 유저 db에 있는지 확인 후 req.user = user로 다음 미들웨어에 넘겨줌.
export async function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) {
    throw new UnauthorizedError('로그인이 필요합니다');
  }
  const payload = verifyAccessToken(token);
  const userId = payload.userId ?? payload.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UnauthorizedError('존재하지 않는 사용자입니다');
  }
  req.user = user;
  next();
}
