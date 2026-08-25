// 빌드 산출물(./out)에 RSS(feed.xml), Atom(atom.xml), sitemap.xml 과
// 옛 슬러그 리다이렉트 스텁을 생성합니다.
// package.json 의 `postbuild` 훅에서 자동 실행됨.

import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { Feed } from "feed"
import { getPosts } from "../src/lib/notion/getPosts"

const CONFIG = require("../site.config")

const OUT_DIR = process.env.OUT_DIR || "out"
const SITE_URL: string = CONFIG.blog.siteUrl.replace(/\/$/, "")
const RSS_ITEM_LIMIT = 20

const postUrl = (slug: string) => `${SITE_URL}/posts/${encodeURIComponent(slug)}/`

async function buildRss(posts: Awaited<ReturnType<typeof getPosts>>) {
  const feed = new Feed({
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    id: SITE_URL + "/",
    link: SITE_URL + "/",
    language: CONFIG.blog.language || "ko-KR",
    copyright: `© ${new Date().getFullYear()} Imweb`,
    feedLinks: {
      rss: `${SITE_URL}/feed.xml`,
      atom: `${SITE_URL}/atom.xml`,
    },
    author: { name: CONFIG.blog.author || "Imweb Tech" },
  })

  for (const p of posts.slice(0, RSS_ITEM_LIMIT)) {
    const url = postUrl(p.slug)
    feed.addItem({
      title: p.title,
      id: url,
      link: url,
      description: p.summary || undefined,
      date: p.date ? new Date(p.date) : new Date(),
      category:
        p.category.length > 0 ? p.category.map((c) => ({ name: c })) : undefined,
      author:
        p.authors.length > 0
          ? p.authors.map((a) => ({ name: a.name }))
          : undefined,
    })
  }

  writeFileSync(join(OUT_DIR, "feed.xml"), feed.rss2())
  writeFileSync(join(OUT_DIR, "atom.xml"), feed.atom1())
  console.log(`✓ feed.xml / atom.xml (${Math.min(posts.length, RSS_ITEM_LIMIT)} items)`)
}

function buildSitemap(posts: Awaited<ReturnType<typeof getPosts>>) {
  const today = new Date().toISOString().slice(0, 10)
  const entries: { loc: string; lastmod: string; priority: string }[] = [
    { loc: `${SITE_URL}/`, lastmod: today, priority: "1.0" },
    { loc: `${SITE_URL}/tags/`, lastmod: today, priority: "0.5" },
    { loc: `${SITE_URL}/about/`, lastmod: today, priority: "0.3" },
    ...posts.map((p) => ({
      loc: postUrl(p.slug),
      lastmod: p.date || today,
      priority: "0.8",
    })),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`
  writeFileSync(join(OUT_DIR, "sitemap.xml"), xml)
  console.log(`✓ sitemap.xml (${entries.length} entries)`)
}

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// 슬러그를 바꾼 글의 옛 경로에 리다이렉트 스텁을 만든다.
//
// GitHub Pages 는 서버 301 을 지원하지 않으므로 canonical + meta refresh 로 대신한다.
// canonical 이 검색엔진에 "이 문서의 정본은 저기"라고 알려 링크 신호를 새 글로 넘기고,
// meta refresh / JS 가 실제 방문자를 옮긴다.
// noindex 는 일부러 넣지 않는다 — canonical 과 신호가 충돌해 통합이 아니라 색인 삭제로
// 처리될 수 있기 때문.
function buildAliasRedirects(posts: Awaited<ReturnType<typeof getPosts>>) {
  const aliases: Record<string, string> = CONFIG.seo?.slugAliases ?? {}
  const bySlug = new Map(posts.map((p) => [p.slug, p]))
  let made = 0

  for (const [oldSlug, newSlug] of Object.entries(aliases)) {
    // 살아있는 글을 덮어쓰지 않도록 방어 — 이 경우 스텁이 진짜 글을 가려버린다.
    if (bySlug.has(oldSlug)) {
      console.warn(`[alias] "${oldSlug}" 는 현재 발행 중인 슬러그라 건너뜁니다.`)
      continue
    }
    const target = bySlug.get(newSlug)
    if (!target) {
      console.warn(`[alias] "${oldSlug}" → "${newSlug}": 대상 글이 없어 건너뜁니다.`)
      continue
    }

    const url = postUrl(newSlug)
    const safeUrl = escapeAttr(url)
    const html = `<!doctype html>
<html lang="${CONFIG.blog.language || "ko-KR"}">
<head>
<meta charset="utf-8">
<title>${escapeAttr(target.title)} — ${escapeAttr(CONFIG.blog.title)}</title>
<link rel="canonical" href="${safeUrl}">
<meta http-equiv="refresh" content="0; url=${safeUrl}">
<meta name="description" content="${escapeAttr(target.summary || CONFIG.blog.description)}">
<script>location.replace(${JSON.stringify(url)});</script>
</head>
<body>
<p>이 글은 <a href="${safeUrl}">${escapeAttr(target.title)}</a> 으로 이동했습니다.</p>
</body>
</html>
`
    const dir = join(OUT_DIR, "posts", oldSlug)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, "index.html"), html)
    made++
  }
  console.log(`✓ 리다이렉트 스텁 (${made} paths)`)
}

async function main() {
  try {
    mkdirSync(OUT_DIR, { recursive: true })
    const posts = await getPosts()
    await buildRss(posts)
    buildSitemap(posts)
    buildAliasRedirects(posts)
  } catch (err) {
    // 빌드 자체는 끝났으므로, RSS/sitemap 생성 실패가 배포를 막지 않도록 경고만.
    console.warn(
      "[feed/sitemap] 생성 실패 — 빈 sitemap 으로 fallback. 다음 빌드에서 자동 복구.",
      err
    )
    // 최소한 빈 sitemap 이라도 만들어 두기 (404 방지)
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>
</urlset>
`
    try {
      writeFileSync(join(OUT_DIR, "sitemap.xml"), fallback)
    } catch {}
  }
}

main()
