"use server";

import * as api from "@/shared/api";
import { setAuthCookies } from "@/shared/auth";
import ActionResult from "@/types/ActionResult";

export interface LoginInput {
  email: string;
  password: string;
  deviceId: string; // ✅ 추가
}

export const login = async ({
  email,
  password,
  deviceId,
}: LoginInput): Promise<ActionResult<null>> => {
  if (!email || !password) {
    return {
      error: "이메일과 비밀번호를 입력해주세요.",
      success: null,
      data: null,
    };
  }
  if (!deviceId) {
    return { error: "deviceId가 필요합니다.", success: null, data: null };
  }

  try {
    // ✅ 핵심: server action에서 백엔드 호출할 때 header로 deviceId 전달
    const { accessToken, refreshToken } = await api.login(
      { email, password },
      { headers: { "X-Device-Id": deviceId } }
    );

    if (!accessToken || !refreshToken) {
      throw new Error("로그인 중 오류가 발생했습니다.");
    }

    await setAuthCookies(accessToken, refreshToken);

    return { error: null, success: "로그인에 성공했습니다.", data: null };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "로그인 중 오류가 발생했습니다.",
      success: null,
      data: null,
    };
  }
};
