import { useState } from "react"
import Link from "next/link"

type Item = { name: string; count: number }

// 사이드바에 노출할 태그 수. 전체 목록은 /tags/ 에서 볼 수 있다.
const TAG_DISPLAY_LIMIT = 12

type SidebarProps = {
  categories: Item[]
  tags: Item[]
  // 전체 글 수 (multi-select 라 카테고리 카운트 합과 다를 수 있어 별도로 전달)
  totalPosts: number
  activeCategory: string | null
  activeTag: string | null
  onCategoryChange: (next: string | null) => void
  onTagChange: (next: string | null) => void
}

// 메인 페이지 사이드바.
// - lg 이상: 좌측에 sticky 로 세로 리스트(카테고리) + 칩(태그)
// - lg 미만: 상단에 "필터" 토글. 펼치면 카테고리/태그를 좌우 2 컬럼으로 나란히
export default function Sidebar(props: SidebarProps) {
  return (
    <aside className="lg:sticky lg:top-20 self-start">
      <NarrowFilters {...props} />
      <DesktopFilters {...props} />
    </aside>
  )
}

// ── 데스크탑 (lg+) ────────────────────────────────────────────────────────
function DesktopFilters({
  categories,
  tags,
  totalPosts,
  activeCategory,
  activeTag,
  onCategoryChange,
  onTagChange,
}: SidebarProps) {

  return (
    <div className="hidden lg:block">
      {categories.length > 0 && (
        <section className="mb-8">
          <SectionLabel>카테고리</SectionLabel>
          <ul className="flex flex-col">
            <li>
              <CategoryRow
                label="전체"
                count={totalPosts}
                active={activeCategory === null && activeTag === null}
                onClick={() => {
                  onCategoryChange(null)
                  onTagChange(null)
                }}
              />
            </li>
            {categories.map((c) => (
              <li key={c.name}>
                <CategoryRow
                  label={c.name}
                  count={c.count}
                  active={activeCategory === c.name}
                  onClick={() => {
                    onCategoryChange(c.name)
                    onTagChange(null)
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {tags.length > 0 && (
        <section>
          <SectionLabel>태그</SectionLabel>
          <TagChips
            tags={tags}
            activeTag={activeTag}
            onTagChange={onTagChange}
          />
        </section>
      )}
    </div>
  )
}

// ── 좁은 화면 (< lg) — 토글 + 2 컬럼 ─────────────────────────────────────
function NarrowFilters({
  categories,
  tags,
  totalPosts,
  activeCategory,
  activeTag,
  onCategoryChange,
  onTagChange,
}: SidebarProps) {
  const [open, setOpen] = useState(false)
  const activeLabel = activeCategory
    ? activeCategory
    : activeTag
      ? `# ${activeTag}`
      : null

  return (
    <div className="lg:hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg border border-line bg-card px-4 py-3 text-sm font-medium text-ink-900 hover:bg-surface transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          필터
          {activeLabel && (
            <span className="max-w-[160px] truncate rounded-full bg-brand text-white text-[11px] font-medium px-2 py-0.5">
              {activeLabel}
            </span>
          )}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-2 gap-4 rounded-lg border border-line bg-card p-4">
          {categories.length > 0 && (
            <section>
              <SectionLabel>카테고리</SectionLabel>
              <div className="flex flex-wrap gap-1.5">
                <CategoryChip
                  label="전체"
                  count={totalPosts}
                  active={activeCategory === null && activeTag === null}
                  onClick={() => {
                    onCategoryChange(null)
                    onTagChange(null)
                  }}
                />
                {categories.map((c) => (
                  <CategoryChip
                    key={c.name}
                    label={c.name}
                    count={c.count}
                    active={activeCategory === c.name}
                    onClick={() => {
                      onCategoryChange(c.name)
                      onTagChange(null)
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {tags.length > 0 && (
            <section>
              <SectionLabel>태그</SectionLabel>
              <TagChips
                tags={tags}
                activeTag={activeTag}
                onTagChange={onTagChange}
              />
            </section>
          )}
        </div>
      )}
    </div>
  )
}

// ── 작은 빌딩 블록 ────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-xs font-semibold tracking-wider uppercase text-ink-500">
      {children}
    </div>
  )
}

function CategoryRow({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-ink-900 text-base font-medium"
          : "text-ink-700 hover:bg-surface hover:text-ink-900"
      }`}
    >
      <span>{label}</span>
      <span className="opacity-60 text-xs tabular-nums">{count}</span>
    </button>
  )
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip text-xs ${active ? "is-active" : ""}`}
    >
      {label}
      <span className="opacity-60">·{count}</span>
    </button>
  )
}

function TagChips({
  tags,
  activeTag,
  onTagChange,
}: {
  tags: Item[]
  activeTag: string | null
  onTagChange: (next: string | null) => void
}) {
  // tags 는 사용 횟수 내림차순. 전부 깔면 사이드바가 지저분해져 상위 N 개만 노출하고,
  // 나머지는 /tags/ 페이지로 넘긴다.
  const shown = tags.slice(0, TAG_DISPLAY_LIMIT)
  // 선택된 태그가 상위 N 밖이면 칩이 사라져 필터 상태가 안 보이므로 함께 노출.
  if (activeTag && !shown.some((t) => t.name === activeTag)) {
    const active = tags.find((t) => t.name === activeTag)
    if (active) shown.push(active)
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((t) => (
        <button
          key={t.name}
          type="button"
          onClick={() => onTagChange(activeTag === t.name ? null : t.name)}
          className={`chip text-xs ${activeTag === t.name ? "is-active" : ""}`}
        >
          # {t.name}
          <span className="opacity-60">·{t.count}</span>
        </button>
      ))}
      {tags.length > shown.length && (
        <Link
          href="/tags/"
          className="px-1.5 text-xs text-ink-500 hover:text-ink-900 transition-colors"
        >
          전체 태그 →
        </Link>
      )}
    </div>
  )
}
