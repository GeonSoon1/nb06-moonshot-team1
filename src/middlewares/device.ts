import { NextFunction, Request, Response } from 'express';
import { sha256 } from '../lib/token';
import { BadRequestError } from './errors/customError';
import { firstQuery } from '../lib/utils/oAuth';

export function requireDevice(req: Request, _res: Response, next: NextFunction): void {
  const fromHeader = req.get('x-device-id') ?? undefined;
  const fromQuery = firstQuery(req.query.device_id);
  const deviceId = fromHeader ?? fromQuery;
  if (!deviceId) {
    throw new BadRequestError('deviceId가 필요합니다');
  }
  req.deviceId = deviceId;
  req.deviceIdHash = sha256(deviceId);
  next();
}
