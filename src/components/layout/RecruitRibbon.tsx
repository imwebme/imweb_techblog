import { withBasePath } from "@/lib/utils/withBasePath"
import { useDismissible } from "@/lib/useDismissible"

const CONFIG = require("../../../site.config")

// 채용 이벤트 CTA — 화면 하단에 고정(fixed)되어 스크롤해도 계속 노출됩니다.
// site.config.js 의 recruitCTA.enabled 가 true 이고 href 가 있을 때만 표시.
// 사용자가 닫으면 localStorage 에 영구 기억해 다시 안 띄웁니다.
const STORAGE_KEY = "recruitCTADismissed"

export default function RecruitRibbon() {
  const cta = CONFIG.recruitCTA
  const { dismissed, dismiss } = useDismissible(STORAGE_KEY)

  if (!cta?.enabled || !cta.href || dismissed) return null

  const close = () => dismiss() // ttl 미지정 = 영구

  // 한 그룹 안에서 라벨을 여러 번 반복해 넓은 화면도 채우고, 트랙엔 그룹 2개를 둠
  const group = (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="flex items-center">
          <span className="cta-led px-6 text-sm font-bold uppercase">
            {cta.label}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={withBasePath("/symbol_white.png")}
            alt=""
            aria-hidden
            className="cta-led-logo h-3.5 w-auto shrink-0"
          />
        </span>
      ))}
    </span>
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={cta.label}
        className="block overflow-hidden py-3"
      >
        <div className="cta-marquee-track">
          {group}
          {group}
        </div>
      </a>
      <button
        type="button"
        onClick={close}
        aria-label="배너 닫기"
        className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-black text-white/70 shadow-[-12px_0_12px_rgba(0,0,0,0.9)] transition-colors hover:text-white"
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
    </div>
  )
}
