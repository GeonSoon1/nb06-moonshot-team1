"use client";

import classNames from "classnames/bind";
import Image from "next/image";
import styles from "./SocialButton.module.css";
import OAuthProvider from "@/types/OAuthProivder";
import { getOrCreateDeviceId } from "@/shared/device";

import KakaoImage from "@/public/assets/kakao.png";
import GoogleImage from "@/public/assets/google.png";
import NaverImage from "@/public/assets/naver.png";
import FacebookImage from "@/public/assets/facebook.png";

const cx = classNames.bind(styles);

const SOCIAL_BUTTON_IMAGE_MAP = {
  [OAuthProvider.GOOGLE]: GoogleImage,
  [OAuthProvider.KAKAO]: KakaoImage,
  [OAuthProvider.NAVER]: NaverImage,
  [OAuthProvider.FACEBOOK]: FacebookImage,
};

const AUTH_PATH_MAP = {
  [OAuthProvider.GOOGLE]: "/auth/google",
  [OAuthProvider.KAKAO]: "/auth/kakao",
  [OAuthProvider.NAVER]: "/auth/naver",
  [OAuthProvider.FACEBOOK]: "/auth/facebook",
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const FRONT_URL = process.env.NEXT_PUBLIC_FRONT_URL ?? "http://localhost:3000";

export default function SocialButton({
  provider,
}: {
  provider: OAuthProvider;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const deviceId = getOrCreateDeviceId();

    const url =
      `${API_BASE_URL}${AUTH_PATH_MAP[provider]}` +
      `?redirectTo=${encodeURIComponent(FRONT_URL)}` +
      `&device_id=${encodeURIComponent(deviceId)}`;

    console.log("OAUTH URL =", url);
    window.location.href = url; // assign 대신 href도 OK
  };

  return (
    <button
      type="button"
      className={cx(styles.socialButton, provider)}
      onClick={handleClick}
    >
      <Image
        className={cx(styles.socialButtonImage)}
        src={SOCIAL_BUTTON_IMAGE_MAP[provider]}
        alt={provider}
      />
    </button>
  );
}
