import { useEffect, useState } from "react"

// 분석 쿠키 동의 상태 (영구). useDismissible 과 구조는 비슷하지만
// "동의/거부" 가 필요해서 3-state 로 둡니다.
//   - "pending" : 아직 선택 안 함 → 배너 노출, GA 미로드
//   - "granted" : 명시적 동의 → GA 로드
//   - "denied"  : 명시적 거부 → GA 미로드 (선택은 기억)
//
// SSR 마크업과 어긋나지 않도록 첫 페인트는 "pending" 으로 시작하고
// useEffect 에서 localStorage 를 읽어 동기화합니다.
export type ConsentStatus = "pending" | "granted" | "denied"

const STORAGE_KEY = "analyticsConsent"

export function useConsent(): {
  status: ConsentStatus
  hydrated: boolean
  grant: () => void
  deny: () => void
} {
  const [status, setStatus] = useState<ConsentStatus>("pending")
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY)
      if (v === "granted" || v === "denied") setStatus(v)
    } catch {
      /* localStorage 비활성 환경 무시 */
    }
    setHydrated(true)
  }, [])

  const persist = (next: ConsentStatus) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* noop */
    }
    setStatus(next)
  }

  return {
    status,
    hydrated,
    grant: () => persist("granted"),
    deny: () => persist("denied"),
  }
}
