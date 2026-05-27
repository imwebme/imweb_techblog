import { useEffect, useRef, useState } from "react"
import type { TPost } from "@/types"
import PostCard from "./PostCard"
import PostListItem from "./PostListItem"

type ViewMode = "grid" | "list"

// 한 페이지에 보여줄 글 수. 이 수를 넘으면 페이지네이션이 노출됩니다.
const PAGE_SIZE = 9

// 본문 영역의 포스트 리스트. 그리드/리스트 토글 + 페이지네이션 지원.
// 사이드바 우측 메인 컬럼 안에서 사용됩니다.
// 카테고리/태그 필터는 index 에서 걸러진 `posts` 로 전달되므로, 여기서 페이지를
// 나누면 필터 결과에도 그대로 페이지네이션이 적용됩니다.
export default function PostGrid({
  posts,
  title = "전체 글",
}: {
  posts: TPost[]
  title?: string
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [page, setPage] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)

  // 필터가 바뀌어 목록이 달라지면 1페이지로 초기화
  useEffect(() => {
    setPage(1)
  }, [posts])

  if (!posts.length) {
    return (
      <section className="py-16 text-center text-ink-500">
        조건에 맞는 글이 아직 없어요.
      </section>
    )
  }

  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  const current = Math.min(page, totalPages)
  const pageItems = posts.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const goTo = (next: number) => {
    setPage(next)
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section ref={sectionRef} className="scroll-mt-24">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-h2 sm:text-[1.75rem] font-bold tracking-[-0.025em] text-ink-900">
            {title}
          </h2>
          <span className="text-sm text-ink-500">{posts.length}개</span>
        </div>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {pageItems.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pageItems.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination current={current} total={totalPages} onChange={goTo} />
      )}
    </section>
  )
}

// 1,2,3,4 … 형태의 번호 페이지네이션 (이전/다음 포함, 페이지가 많으면 말줄임)
function Pagination({
  current,
  total,
  onChange,
}: {
  current: number
  total: number
  onChange: (next: number) => void
}) {
  const pages = pageNumbers(current, total)

  const baseBtn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors"

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="페이지네이션"
    >
      <button
        type="button"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="이전 페이지"
        className={`${baseBtn} text-ink-700 hover:bg-surface disabled:opacity-40 disabled:pointer-events-none`}
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`gap-${i}`}
            className="inline-flex h-9 min-w-9 items-center justify-center text-ink-500"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === current ? "page" : undefined}
            className={`${baseBtn} ${
              p === current
                ? "bg-ink-900 text-base"
                : "text-ink-700 hover:bg-surface"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="다음 페이지"
        className={`${baseBtn} text-ink-700 hover:bg-surface disabled:opacity-40 disabled:pointer-events-none`}
      >
        ›
      </button>
    </nav>
  )
}

// 현재 페이지 주변 + 처음/끝을 보여주고 사이를 "…" 로 줄입니다.
// 전체가 7 이하면 모두 노출.
function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const result: (number | "…")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) result.push("…")
  for (let i = start; i <= end; i++) result.push(i)
  if (end < total - 1) result.push("…")
  result.push(total)
  return result
}

function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (next: ViewMode) => void
}) {
  const itemClass = (active: boolean) =>
    `inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
      active
        ? "bg-card text-ink-900 shadow-sm"
        : "text-ink-500 hover:text-ink-900"
    }`

  return (
    <div
      role="group"
      aria-label="보기 방식"
      className="inline-flex items-center rounded-lg bg-surface p-1 border border-line"
    >
      <button
        type="button"
        aria-pressed={value === "grid"}
        aria-label="그리드로 보기"
        onClick={() => onChange("grid")}
        className={itemClass(value === "grid")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
      <button
        type="button"
        aria-pressed={value === "list"}
        aria-label="리스트로 보기"
        onClick={() => onChange("list")}
        className={itemClass(value === "list")}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" />
          <circle cx="4" cy="12" r="1" />
          <circle cx="4" cy="18" r="1" />
        </svg>
      </button>
    </div>
  )
}
