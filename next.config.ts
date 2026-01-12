import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/projects",
        permanent: false,
      },
      {
        source: "/projects/:projectId",
        destination: "/projects/:projectId/tasks",
        permanent: false,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https", // 배포 주소는 https입니다.
        hostname: "nb06-moonshot-team1-jity.onrender.com", // 복사한 백엔드 주소
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "10000", // 로컬 테스트용은 유지해도 좋습니다.
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

  webpack: (config) => {
    // @ts-expect-error 타입 에러 무시
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              typescript: true,
              ext: "tsx",
            },
          },
        ],
      }
    );
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default nextConfig;
