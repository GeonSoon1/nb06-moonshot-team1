import { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncHandler(handler: RequestHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e) {
      // asyncHandler의 catch(e)가 에러를 잡아 errorHandler에게 넘긴다.
      next(e); // next()안에 인자가 있네? err핸들러 찾아
    }
  };
}
