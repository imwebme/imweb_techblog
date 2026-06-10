import { useState } from "react"
import type { TPost } from "@/types"

// 글 하단 액션 바. 공유하기 (Web Share API + 클립보드 fallback).
export default function PostActions({ post }: { post: TPost }) {
  const [shareLabel, setShareLabel] = useState<"공유하기" | "링크 복사됨">(
    "공유하기"
  )

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const nav = typeof navigator !== "undefined" ? (navigator as any) : null

    // 데스크톱(마우스) → 클립보드 복사로 통일.
    // 모바일·태블릿(터치) 에서만 OS 공유 시트를 띄워 메신저·AirDrop 등으로 보냄.
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches

    if (isTouchDevice && nav?.share) {
      try {
        await nav.share({ title: post.title, text: post.summary || "", url })
        return
      } catch {
        // 사용자가 공유 시트를 닫은 경우 — fallback 없이 종료
        return
      }
    }

    if (nav?.clipboard?.writeText) {
      try {
        await nav.clipboard.writeText(url)
        setShareLabel("링크 복사됨")
        setTimeout(() => setShareLabel("공유하기"), 2000)
      } catch {}
    }
  }

  return (
    <div className="container mx-auto max-w-prose flex items-center justify-center pt-2 pb-12">
      <button
        type="button"
        onClick={onShare}
        aria-label="공유하기"
        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border bg-card border-line text-ink-700 hover:border-ink-500 hover:text-ink-900 transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>{shareLabel}</span>
      </button>
    </div>
  )
}
