import { BadRequestError } from '../middlewares/errors/customError.js';

export function requireRefresh(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new BadRequestError();
  }
  const token = header.split(' ')[1];
  if (!token) {
    throw new BadRequestError();
  }
  req.refreshToken = token;
  next();
}
