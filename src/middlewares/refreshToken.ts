import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from './errors/customError';

export function requireRefresh(req: Request, _res: Response, next: NextFunction) {
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
