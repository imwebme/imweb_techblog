import { useCallback, useEffect, useState } from "react"

// 라이트/다크 테마 관리.
// - 실제 테마 적용(=<html> 의 .dark 클래스)은 _document 의 인라인 스크립트가
//   페인트 전에 처리(FOUC 방지)하고, 여기서는 토글/구독만 담당합니다.
// - 기본은 라이트. 사용자가 토글로 다크를 선택하면 localStorage 에 저장해 유지합니다.

export type Theme = "light" | "dark"

const STORAGE_KEY = "theme"
const EVENT = "themechange"

function currentTheme(): Theme {
  if (typeof document === "undefined") return "light"
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

// 테마를 적용하고(클래스 토글) localStorage 저장 + 구독자에게 알림
export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* localStorage 사용 불가 환경 무시 */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: theme }))
}

// [현재 테마, 토글 함수] 를 반환. SSR/첫 CSR 는 "light" 로 일치시켜 hydration mismatch 회피.
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    setTheme(currentTheme())

    const onChange = () => setTheme(currentTheme())
    window.addEventListener(EVENT, onChange)

    return () => window.removeEventListener(EVENT, onChange)
  }, [])

  const toggle = useCallback(() => {
    applyTheme(currentTheme() === "dark" ? "light" : "dark")
  }, [])

  return [theme, toggle]
}

// 초기 마운트 여부 — 아이콘 등 테마 의존 UI 의 hydration 안정화에 사용
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
