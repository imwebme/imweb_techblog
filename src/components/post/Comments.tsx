import Giscus from "@giscus/react"

const CONFIG = require("../../../site.config")

// GitHub Discussions 기반 댓글 (giscus).
// 설정이 비어있으면 아무것도 렌더링하지 않습니다.
// site.config.js 의 comments.giscus 참고.
export default function Comments() {
  const g = CONFIG.comments?.giscus
  if (!g?.enabled || !g.repoId || !g.categoryId) return null

  return (
    <section className="container mx-auto max-w-prose py-12">
      <h2 className="mb-6 text-h3 font-bold tracking-[-0.02em] text-ink-900">
        댓글
      </h2>
      <Giscus
        repo={g.repo}
        repoId={g.repoId}
        category={g.category}
        categoryId={g.categoryId}
        mapping={g.mapping || "pathname"}
        strict="0"
        reactionsEnabled={g.reactionsEnabled || "1"}
        emitMetadata="0"
        inputPosition={g.inputPosition || "bottom"}
        theme="light"
        lang={g.lang || "ko"}
        loading="lazy"
      />
    </section>
  )
}
