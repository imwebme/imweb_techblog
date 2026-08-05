// 배포 전 최종 안전장치.
//
// 노션 fetch 가 실패하면 safeAsync 가 빈 배열로 fallback 하기 때문에 빌드는 그대로
// "성공"으로 끝나고, 글이 하나도 없는 사이트가 그대로 배포됩니다.
// (2026-08-05: Cloudflare 403 으로 17시간 동안 전 글 미노출)
//
// 그래서 out/index.html 에 실제로 글이 들어갔는지 확인하고, 0건이면 종료코드 1 로
// 배포를 막습니다. 직전에 배포된 정상 사이트가 그대로 남습니다.

import { readFileSync } from "node:fs"

const OUT_INDEX = "out/index.html"

const html = readFileSync(OUT_INDEX, "utf8")
const match = html.match(
  /id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s
)

if (!match) {
  console.error(`[verify-build] ${OUT_INDEX} 에서 __NEXT_DATA__ 를 찾지 못했습니다.`)
  process.exit(1)
}

const posts = JSON.parse(match[1])?.props?.pageProps?.posts ?? []

if (posts.length === 0) {
  console.error(
    "[verify-build] 글이 0건입니다 — 노션 fetch 실패로 판단해 배포를 중단합니다.\n" +
      "빌드 로그의 '노션 fetch 실패' 항목을 확인하세요. 직전 배포본은 그대로 유지됩니다."
  )
  process.exit(1)
}

console.log(`[verify-build] 글 ${posts.length}건 확인 — 배포를 진행합니다.`)
