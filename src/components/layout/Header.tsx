import Link from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect, useRef, FormEvent } from "react"
import { withBasePath } from "@/lib/utils/withBasePath"
import ThemeToggle from "./ThemeToggle"

const CONFIG = require("../../../site.config")

// 상단 헤더. 얇고 가벼운 네비게이션, 스크롤 시 살짝 진해집니다.
export default function Header() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // 페이지 이동 시 모바일 메뉴 자동 닫힘
  useEffect(() => {
    setMenuOpen(false)
  }, [router.asPath])

  const onSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = searchRef.current?.value.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  const navLinkClass =
    "rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-surface transition-colors"

  const navItems = CONFIG.nav as {
    label: string
    href: string
    external?: boolean
  }[]

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-smooth ${
        scrolled
          ? "bg-[var(--color-header-bg)] backdrop-blur-md border-b border-line"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center"
          aria-label={CONFIG.blog.title}
        >
          {/* 라이트=검정, 다크=흰색 로고 자동 전환 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath("/Logo_ImwebTech_black.svg")}
            alt={CONFIG.blog.title}
            className="h-7 w-auto dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath("/Logo_ImwebTech_white.svg")}
            alt={CONFIG.blog.title}
            className="h-7 w-auto hidden dark:block"
          />
        </Link>

        <div className="flex flex-1 sm:flex-none items-center justify-end gap-1 sm:gap-2 min-w-0 pl-3 sm:pl-0">
          {/* 데스크탑(≥sm): 인라인 네비 */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navLinkClass}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={navLinkClass}>
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* 검색 — 모바일에선 남는 폭을 채우고(검색바 노출), ≥sm 에선 고정폭 */}
          <form
            onSubmit={onSubmitSearch}
            role="search"
            className="flex flex-1 sm:flex-none relative items-center min-w-0"
          >
            <svg
              className="pointer-events-none absolute left-3 text-ink-500"
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
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={searchRef}
              type="search"
              name="q"
              placeholder="검색"
              aria-label="검색"
              className="h-9 w-full sm:w-40 lg:w-48 rounded-lg bg-surface pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-500 outline-none border border-transparent transition-colors hover:bg-surface focus:bg-card focus:border-line"
            />
          </form>

          {/* 모바일(<sm): 메뉴 토글 */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="메뉴"
            aria-expanded={menuOpen}
            className="sm:hidden inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-700 hover:text-ink-900 hover:bg-surface transition-colors"
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
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* 모바일 네비 드롭다운 */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-line bg-[var(--color-header-bg)] backdrop-blur-md">
          <div className="container mx-auto flex flex-col py-2">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-2 py-3 text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-surface transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-2 py-3 text-sm font-medium text-ink-700 hover:text-ink-900 hover:bg-surface transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
