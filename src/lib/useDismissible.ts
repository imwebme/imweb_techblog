import { useEffect, useState } from "react"

// localStorage 에 닫힘 상태를 기억하는 공용 훅.
// - 영구 닫기: dismiss() — 값 "1" 저장. 다음 방문에도 안 뜸.
// - 일정 시간 닫기: dismiss(ttlMs) — 만료 timestamp 저장. 만료 후 다시 노출.
// 첫 페인트는 "숨김"(dismissed=true) 으로 시작하고, 마운트 후 localStorage 를
// 읽어 닫은 기록이 없을 때만 보이게 합니다.
//
// 반대로 "보임"으로 시작하면 정적 HTML 에 모달·리본이 그대로 박혀, 이미 닫은
// 사람에게도 JS 가 로드될 때까지 떴다가 사라지고(느린 모바일에선 1~2초) 그동안은
// 닫기 버튼도 동작하지 않습니다. 숨김으로 시작해도 SSR/CSR 첫 마크업은 둘 다
// "없음"으로 일치하므로 hydration 문제는 없습니다.
export function useDismissible(key: string): {
  dismissed: boolean
  dismiss: (ttlMs?: number) => void
} {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    try {
      const v = localStorage.getItem(key) || ""
      if (v === "1") return
      const until = parseInt(v, 10)
      if (until && Date.now() < until) return
    } catch {
      // localStorage 를 못 쓰는 환경에선 닫은 기록을 알 수 없으니 그냥 노출.
    }
    setDismissed(false)
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
