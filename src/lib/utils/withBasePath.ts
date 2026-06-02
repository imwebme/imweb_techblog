// GitHub Pages 프로젝트 사이트 (https://imwebme.github.io/imweb_techblog) 에서
// 모든 정적 자산 경로 앞에 /imweb_techblog 가 붙어야 합니다.
// next.config.js 에서 NEXT_PUBLIC_BASE_PATH 를 노출하므로 이를 활용합니다.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ""

export const withBasePath = (path: string): string => {
  if (!path) return BASE || "/"
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  if (!BASE) return path
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`
}
