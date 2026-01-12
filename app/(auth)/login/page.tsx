"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import { toast } from "react-toastify";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import Label from "@/shared/components/Label";
import OAuthProvider from "@/types/OAuthProivder";
import SocialButton from "../components/SocialButton";
import { login } from "./actions"; // ✅ LoginInput 굳이 여기서 안 써도 됨
import styles from "../shared.module.css";
import { getOrCreateDeviceId } from "@/shared/device";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const cx = classNames.bind(styles);

type LoginFormState = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();

  // ✅ 브라우저에서 deviceId 확보 (소셜 로그인 링크에도 써야 해서 여기서 한번 만들기)
  const deviceId = getOrCreateDeviceId();

  const [state, dispatch, isPending] = useActionState(
    async (_: LoginFormState, formData: FormData) => {
      const values: LoginFormState = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      };

      // ✅ deviceId가 없으면 백엔드에서 막히니까 여기서 방어
      if (!deviceId) {
        toast.error(
          "deviceId 생성에 실패했습니다. 새로고침 후 다시 시도해주세요."
        );
        return values;
      }

      // ✅ server action에 deviceId도 같이 전달
      const result = await login({ ...values, deviceId });

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        router.push("/");
      }

      return values;
    },
    {
      email: "",
      password: "",
    }
  );

  return (
    <div className={cx(styles.container)}>
      <h1 className={cx(styles.title)}>로그인</h1>
      <form className={cx(styles.form)} action={dispatch}>
        <div className={cx(styles.inputContainer)}>
          <Label>이메일</Label>
          <Input
            type="email"
            name="email"
            defaultValue={state.email}
            placeholder="example@email.com"
            required
          />
        </div>
        <div className={cx(styles.inputContainer)}>
          <Label>비밀번호</Label>
          <Input
            type="password"
            name="password"
            defaultValue={state.password}
            placeholder="비밀 번호"
            required
          />
        </div>

        <Button type="submit" disabled={isPending}>
          로그인
        </Button>
      </form>

      <div className={cx(styles.registerLinkContainer)}>
        Moonshot이 처음이신가요? <Link href="/register">가입하기</Link>
      </div>

      <div className={cx(styles.socialLoginContainer)}>
        <p className={cx(styles.socialButtonTitle)}>SNS 간편 로그인</p>
        <div className={cx(styles.socialButtonContainer)}>
          {/* ✅ 소셜 로그인은 header를 못 붙이니까 device_id를 query로 붙여야 함 */}
          <a
            href={`${API_BASE}/auth/naver?device_id=${encodeURIComponent(
              deviceId
            )}`}
          >
            <SocialButton provider={OAuthProvider.NAVER} />
          </a>

          <a
            href={`${API_BASE}/auth/google?device_id=${encodeURIComponent(
              deviceId
            )}`}
          >
            <SocialButton provider={OAuthProvider.GOOGLE} />
          </a>

          <a
            href={`${API_BASE}/auth/facebook?device_id=${encodeURIComponent(
              deviceId
            )}`}
          >
            <SocialButton provider={OAuthProvider.FACEBOOK} />
          </a>

          <a
            href={`${API_BASE}/auth/kakao?device_id=${encodeURIComponent(
              deviceId
            )}`}
          >
            <SocialButton provider={OAuthProvider.KAKAO} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
