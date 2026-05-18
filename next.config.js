/** @type {import('next').NextConfig} */

// GitHub Pages 정적 배포 설정
// - 사용자 페이지(github.io)가 아닌 프로젝트 페이지(/imweb_techblog)일 경우 basePath 가 필요합니다.
// - CI 환경에서는 GITHUB_PAGES=true, BASE_PATH=/imweb_techblog 를 주입합니다.
const isGithubPages = process.env.GITHUB_PAGES === "true"
const basePath = isGithubPages ? process.env.BASE_PATH || "/imweb_techblog" : ""

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "export",
  trailingSlash: true,
  // next/image 를 사용하지 않으므로 unoptimized true 만 켜두면 충분.
  // (remotePatterns 는 next/image 최적화에만 사용되므로 불필요)
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = nextConfig
