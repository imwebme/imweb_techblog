import { useCallback, useEffect, useMemo, useState } from "react"
import type { ExtendedRecordMap, PageBlock } from "notion-types"
import { getPageTableOfContents } from "notion-utils"
import { unwrap } from "@/lib/notion/mapPage"

// sticky 헤더(h-16 = 64px) 아래로 제목이 가려지지 않게 하는 여유값.
// 스크롤 이동 목적지와 "현재 섹션" 판정 기준선에 함께 쓴다.
const SCROLL_OFFSET = 88

// 목차를 띄울 최소 제목 수. 1개짜리는 목차랄 게 없어 노출하지 않는다.
const MIN_HEADINGS = 2

// 본문 칼럼(max-w-prose = 768px) 의 절반. 목차를 그 바깥 오른쪽에 붙인다.
const PROSE_HALF = 384
const RAIL_GAP = 24

// react-notion-x 는 제목 DOM 에 `data-id` 를 하이픈 없는 형태로 넣고,
// notion-utils 의 목차 항목 id 는 하이픈이 붙은 UUID 다. 양쪽을 모두 시도한다.
const findHeadingEl = (id: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[data-id="${id}"]`) ??
  document.querySelector<HTMLElement>(`[data-id="${id.replace(/-/g, "")}"]`)

export default function PostToc({
  recordMap,
}: {
  recordMap: ExtendedRecordMap
}) {
  // 레코드는 { spaceId, value: { value: block, role } } 로 이중 래핑돼 오므로
  // unwrap 으로 푼다. recordMap 에는 글 페이지 말고 collection_view_page 도
  // 섞여 있어, 첫 블록을 쓰지 않고 `page` 타입을 찾아낸다.
  const entries = useMemo(() => {
    const page = Object.keys(recordMap.block)
      .map((k) => unwrap(recordMap.block[k]))
      .find((b) => b?.type === "page") as PageBlock | undefined
    if (!page) return []
    try {
      return getPageTableOfContents(page, recordMap)
    } catch {
      // 목차는 부가 기능이다. 추출에 실패해도 본문 렌더를 막지 않는다.
      return []
    }
  }, [recordMap])

  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (entries.length < MIN_HEADINGS) return

    const targets = entries
      .map((e) => ({ id: e.id, el: findHeadingEl(e.id) }))
      .filter((t): t is { id: string; el: HTMLElement } => t.el !== null)
    if (targets.length === 0) return

    let raf = 0
    const update = () => {
      raf = 0
      // 기준선을 지난 마지막 제목이 현재 섹션. 제목은 문서 순서라 먼저
      // 기준선 위로 올라온 것부터 차례로 갱신된다.
      let current = targets[0].id
      for (const { id, el } of targets) {
        if (el.getBoundingClientRect().top > SCROLL_OFFSET + 8) break
        current = id
      }
      setActiveId(current)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [entries])

  const handleClick = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = findHeadingEl(id)
    if (!el) return
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches
    window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top - SCROLL_OFFSET,
      behavior: reduceMotion ? "auto" : "smooth",
    })
  }, [])

  if (entries.length < MIN_HEADINGS) return null

  return (
    // 본문 칼럼 바깥 오른쪽에 고정. 레일을 놓을 가로 여백이 확보되는
    // xl(1280px) 이상에서만 노출하고, 그 아래에서는 본문을 가리므로 숨긴다.
    <nav
      aria-label="목차"
      className="no-scrollbar fixed z-30 hidden max-h-[calc(100vh-160px)] w-[200px] overflow-y-auto xl:block"
      style={{ top: 96, left: `calc(50% + ${PROSE_HALF + RAIL_GAP}px)` }}
    >
      <p className="mb-3 text-xs font-semibold tracking-wide text-ink-500">
        목차
      </p>
      <ul className="space-y-1 border-l border-line">
        {entries.map((entry) => {
          const isActive = activeId === entry.id
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                onClick={(e) => handleClick(e, entry.id)}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1 pr-2 text-xs leading-relaxed transition-colors ${
                  isActive
                    ? "border-brand font-medium text-ink-900"
                    : "border-transparent text-ink-500 hover:text-ink-900"
                }`}
                style={{ paddingLeft: 12 + entry.indentLevel * 12 }}
              >
                {entry.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
