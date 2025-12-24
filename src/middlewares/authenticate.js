import { prisma } from '../lib/prismaClient.js'
import { verifyAccessToken } from '../lib/token.js'
import { ACCESS_TOKEN_COOKIE_NAME } from '../lib/constants.js'


// 브라우저로부터 넘어온 토큰을 검사하고 유저 db에 있는지 확인 후 req.user = user로 다음 미들웨어에 넘겨줌.
export const authenticate = (async(req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME]

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { userId } = verifyAccessToken(accessToken) // 실패 시 asyncHandler가 잡음

  const user = await prisma.user.findUnique({ where: { id: userId }}) // 실패 시 asyncHandler가 잡음

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  req.user = user
  next()
})