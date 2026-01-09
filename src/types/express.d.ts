import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: User;
      deviceId?: string;
      deviceIdHash?: string;
      // requireRefresh에서 세팅
      refreshToken?: string;
    }
  }
}
