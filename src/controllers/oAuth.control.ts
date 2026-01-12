import { CreateUserBodyStruct, LoginUserBodyStruct } from '../structs/oAuth.structs';
import { create } from 'superstruct';
import { BadRequestError } from '../middlewares/errors/customError';
import { oAuthService } from '../services/oAuth.service';
import { firstQuery, requireQuery, setAuthCookies } from '../lib/utils/oAuth';
import { Request, Response } from 'express';
import * as fileService from '../services/file.service';

//auth/google  (브라우저에서 눌렀을 때 구글 로그인으로 보내기)
export async function googleAuth(req: Request, res: Response) {
  const redirectTo = firstQuery(req.query.redirectTo);
  const deviceId = req.deviceId;
  if (!deviceId) throw new BadRequestError('deviceId가 필요합니다');
  const url = oAuthService.buildGoogleAuthUrl({ redirectTo, deviceId });
  return res.redirect(url);
}

//구글 콜백
export async function googleCallback(req: Request, res: Response) {
  const code = requireQuery(req.query.code, 'code');
  const state = requireQuery(req.query.state, 'state');
  const { accessToken, refreshToken, redirectTo } = await oAuthService.googleCallback({
    code,
    state
  });
  if (!redirectTo) {
    throw new BadRequestError();
  }
  setAuthCookies(res, { accessToken, refreshToken });
  return res.redirect(redirectTo);
}

//회원가입
// export async function register(req: Request, res: Response) {
//   const { name, email, password, profileImage } = create(req.body, CreateUserBodyStruct);
//   const userWithoutPassword = await oAuthService.register({
//     name,
//     email,
//     password,
//     profileImage
//   });
//   return res.status(201).send(userWithoutPassword);
// }
//--------------
export async function register(req: Request, res: Response) {
  const profileUrl = req.file ? fileService.getFileResponse(req, req.file).url : null;
  const body = {
    ...req.body,
    profileImage: profileUrl ?? req.body.profileImage ?? null
  };
  const { name, email, password, profileImage } = create(body, CreateUserBodyStruct);
  const userWithoutPassword = await oAuthService.register({
    name,
    email,
    password,
    profileImage
  });
  return res.status(201).send(userWithoutPassword);
}
//--------------
//로그인
export async function login(req: Request, res: Response) {
  const { email, password } = create(req.body, LoginUserBodyStruct);
  const deviceIdHash = req.deviceIdHash;
  if (!deviceIdHash) {
    throw new BadRequestError('deviceId가 필요합니다');
  }
  const result = await oAuthService.login({ email, password, deviceIdHash });
  return res.status(200).json(result);
}

//리프레쉬 토큰 : 로테이션 방식 (refresh 토큰 1회용, 사용자가 요청할 때마다 새로운 토큰 발급, 이전 토큰 무효화)
export async function refresh(req: Request, res: Response) {
  const refreshToken = req.refreshToken;
  const deviceIdHash = req.deviceIdHash;
  if (!refreshToken || !deviceIdHash) {
    throw new BadRequestError('refreshToken/deviceIdHash가 필요합니다');
  }
  const tokens = await oAuthService.refreshTokens({ refreshToken, deviceIdHash });
  return res.status(200).json(tokens);
}
