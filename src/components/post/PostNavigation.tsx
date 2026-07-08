import Link from "next/link"

export type AdjacentPost = {
  slug: string
  title: string
} | null

// 글 하단 이전/다음 글 내비. 발행일 인접 기준 (getPosts 는 최신순 반환).
// prev = 더 예전 글 · next = 더 최신 글. 둘 다 없으면 렌더 안 함.
export default function PostNavigation({
  prev,
  next,
}: {
  prev: AdjacentPost
  next: AdjacentPost
}) {
  if (!prev && !next) return null
  return (
    <nav
      aria-label="이전·다음 글"
      className="container mx-auto max-w-prose pt-4 pb-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prev ? (
          <NavCard direction="prev" post={prev} />
        ) : (
          // next 만 있어도 우측 위치 유지되도록 좌측 자리 확보 (sm+)
          <div className="hidden sm:block" />
        )}
        {next ? <NavCard direction="next" post={next} /> : null}
      </div>
    </nav>
  )
}

function NavCard({
  direction,
  post,
}: {
  direction: "prev" | "next"
  post: NonNullable<AdjacentPost>
}) {
  const label = direction === "prev" ? "← 이전 글" : "다음 글 →"
  return (
    <Link
      href={`/posts/${encodeURIComponent(post.slug)}/`}
      className={`group flex flex-col gap-1 rounded-card border border-line bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover ${
        direction === "next" ? "sm:text-right" : ""
      }`}
    >
      <span className="text-xs font-medium text-ink-500">{label}</span>
      <span className="text-sm font-semibold text-ink-900 line-clamp-2 group-hover:text-brand">
        {post.title}
      </span>
    </Link>
  )
}
