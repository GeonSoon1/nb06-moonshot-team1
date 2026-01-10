import * as Axios from "axios";
import { getAccessToken, refreshTokens } from "./auth";
import { getOrCreateDeviceId } from "./device";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const axios = Axios.default.create({
  baseURL: BASE_URL,
});

axios.interceptors.request.use(async (config) => {
  // headers 안전 처리
  config.headers = config.headers ?? {};

  // 1) access token
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    // 토큰 없을 때 Authorization 남아있으면 제거(선택)
    delete (config.headers as any).Authorization;
  }

  // 2) device id
  const deviceId = getOrCreateDeviceId();
  if (deviceId) {
    config.headers["X-Device-Id"] = deviceId;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest) {
      await refreshTokens();
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);
