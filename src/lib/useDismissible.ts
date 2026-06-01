import { useEffect, useState } from "react"

// localStorage 에 닫힘 상태를 기억하는 공용 훅.
// - 영구 닫기: dismiss() — 값 "1" 저장. 다음 방문에도 안 뜸.
// - 일정 시간 닫기: dismiss(ttlMs) — 만료 timestamp 저장. 만료 후 다시 노출.
// 첫 페인트는 "보임"(dismissed=false) 으로 시작해 SSR/CSR 마크업을 일치시키고,
// useEffect 에서 localStorage 를 읽어 필요 시 숨깁니다.
export function useDismissible(key: string): {
  dismissed: boolean
  dismiss: (ttlMs?: number) => void
} {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem(key) || ""
      if (v === "1") {
        setDismissed(true)
        return
      }
      const until = parseInt(v, 10)
      if (until && Date.now() < until) setDismissed(true)
    } catch {
      /* localStorage 비활성 환경 무시 */
    }
  }, [key])

  const dismiss = (ttlMs?: number) => {
    try {
      localStorage.setItem(
        key,
        ttlMs == null ? "1" : String(Date.now() + ttlMs)
      )
    } catch {
      /* noop */
    }
    setDismissed(true)
  }

  return { dismissed, dismiss }
}
