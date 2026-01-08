import { sha256 } from '../lib/token.js';
import { BadRequestError } from './errors/customError.js';

export function requireDevice(req, _res, next) {
  const raw =
    req.get('x-device-id') || // axios 요청 (로컬 서비스 로그인 시)
    req.query.device_id; //구글 로그인 시
  // 혹시 device_id가 배열로 들어오는 케이스 방어 (ex: ?device_id=a&device_id=b)
  const deviceId = Array.isArray(raw) ? raw[0] : raw;
  if (!deviceId || typeof deviceId !== 'string') {
    throw new BadRequestError('deviceId가 필요합니다');
  }
  req.deviceId = deviceId;
  req.deviceIdHash = sha256(deviceId);
  next();
}
