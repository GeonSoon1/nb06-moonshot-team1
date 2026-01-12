// shared/api/axios.ts (혹은 너 프로젝트의 ./axios 경로)
import axiosPkg, {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { getAccessToken, refreshTokens } from "./auth";
import { getOrCreateDeviceId } from "./device";

const isServer = typeof window === "undefined";

// ✅ 서버는 BACKEND_URL(직행), 브라우저는 /api(Next rewrites 프록시)
const BASE_URL = isServer ? process.env.BACKEND_URL : "/api";

export const axios = axiosPkg.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Axios v1 헤더 타입 안전 처리
  if (!config.headers || typeof (config.headers as any).set !== "function") {
    config.headers = new AxiosHeaders(config.headers as any);
  }
  const headers = config.headers as AxiosHeaders;

  const accessToken = await getAccessToken();
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  else headers.delete("Authorization");

  if (!isServer) {
    const deviceId = getOrCreateDeviceId();
    if (deviceId) headers.set("X-Device-Id", deviceId);
  }

  return config;
});

axios.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: unknown) => {
    const error = err as AxiosError;
    const originalRequest = error.config as RetryConfig | undefined;

    if (!error.response || !originalRequest) return Promise.reject(error);

    // refresh 요청에서 401이면 무한루프 방지
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshTokens();
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);
