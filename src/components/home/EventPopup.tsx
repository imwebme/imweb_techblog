import { useEffect, useState } from "react"
import { useDismissible } from "@/lib/useDismissible"
import { withBasePath } from "@/lib/utils/withBasePath"

const CONFIG = require("../../../site.config")

// 메인 페이지 이벤트 홍보 팝업.
// - site.config.js 의 eventPopup.enabled 가 true 일 때만 노출
// - "오늘 하루 보지 않기" → 그날의 로컬 자정까지만 숨김 (캘린더 기준 "오늘")
// - X / 배경 / ESC → 세션 한정 닫기(저장 없음, 다음 진입 시 다시 노출)
const STORAGE_KEY = "eventPopupDismissedUntil"

// 지금부터 다음 로컬 자정까지의 ms.
// 24h 슬라이딩이 아니라 캘린더 "오늘" 끝까지만 숨겨, 라벨과 동작을 일치시킵니다.
const msUntilNextMidnight = () => {
  const now = new Date()
  const next = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  )
  return next.getTime() - now.getTime()
}

export default function EventPopup() {
  const ev = CONFIG.eventPopup
  const { dismissed, dismiss } = useDismissible(STORAGE_KEY)
  const [closedSession, setClosedSession] = useState(false)
  const open = !!ev?.enabled && !dismissed && !closedSession

  // ESC 로 닫기 (세션 한정)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setClosedSession(true)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  if (!open) return null

  const closeSession = () => setClosedSession(true)
  const closeForDay = () => dismiss(msUntilNextMidnight())

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-popup-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      {/* 배경 (클릭 시 닫힘) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeSession}
        aria-hidden
      />

      {/* 카드 — 사이즈 적당히, 화면 너무 안 가리게 */}
      <div className="event-popup-card relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-card shadow-2xl">
        <button
          type="button"
          onClick={closeSession}
          aria-label="닫기"
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md bg-card/80 text-ink-500 backdrop-blur transition-colors hover:bg-surface hover:text-ink-900"
        >
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
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {ev.image && (
          // eslint-disable-next-line @next/next/no-img-element
          // 이미지 본래 비율 그대로 — 16:9, OG(40:21), 1:1 등 어떤 비율도 자동 적응.
          <img
            src={withBasePath(ev.image)}
            alt={ev.title || "event"}
            className="block w-full h-auto"
            loading="eager"
          />
        )}

        <div className="p-6 sm:p-7">
        {ev.badge && (
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">
            {ev.badge}
          </div>
        )}
        <h2
          id="event-popup-title"
          className="mt-2 text-xl font-bold leading-tight tracking-[-0.02em] text-ink-900 sm:text-2xl"
        >
          {ev.title}
        </h2>
        {ev.description && (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-700">
            {ev.description}
          </p>
        )}

        {(ev.date || ev.place) && (
          <dl className="mt-5 grid grid-cols-1 gap-1.5 text-sm">
            {ev.date && (
              <div className="flex gap-3">
                <dt className="w-10 shrink-0 text-ink-500">일시</dt>
                <dd className="font-medium text-ink-900">{ev.date}</dd>
              </div>
            )}
            {ev.place && (
              <div className="flex gap-3">
                <dt className="w-10 shrink-0 text-ink-500">장소</dt>
                <dd className="font-medium text-ink-900">{ev.place}</dd>
              </div>
            )}
          </dl>
        )}

        <a
          href={ev.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink-900 px-5 py-3 text-sm font-semibold text-base transition-opacity hover:opacity-90"
        >
          {ev.ctaLabel}
          <span aria-hidden>→</span>
        </a>

        <button
          type="button"
          onClick={closeForDay}
          className="mt-3 block w-full text-center text-xs text-ink-500 hover:text-ink-700"
        >
          오늘 하루 보지 않기
        </button>
        </div>
      </div>
    </div>
  )
}
