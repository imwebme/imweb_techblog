import { useRouter } from "next/router"
import { withBasePath } from "@/lib/utils/withBasePath"
import { useDismissible } from "@/lib/useDismissible"

const CONFIG = require("../../../site.config")

// 채용 이벤트 CTA — 화면 하단에 고정(fixed)되어 스크롤해도 계속 노출됩니다.
// 홈(`/`)에서만 노출하고, 글 상세·태그·검색·소개 등 다른 페이지에선 미렌더.
// site.config.js 의 recruitCTA.enabled 가 true 이고 href 가 있을 때만 표시.
// 사용자가 닫으면 7일간 숨기고, 그 뒤엔 다시 띄웁니다.
// (예전엔 영구 닫기라 한 번 닫은 방문자는 채용 문구가 바뀌어도 다시 볼 수 없었다)
//
// 키 이름을 바꾼 이유: 예전 키(recruitCTADismissed)에는 영구 닫기 값 "1" 이
// 남아 있어, 같은 키를 쓰면 이미 닫은 사람에겐 7일 규칙이 영영 적용되지 않는다.
// 새 키로 옮겨 기존에 닫은 사람도 한 번 다시 보게 하고, 이후부턴 7일 주기를 따른다.
const STORAGE_KEY = "recruitCTADismissedUntil"
const HIDE_MS = 7 * 24 * 60 * 60 * 1000

export default function RecruitRibbon() {
  const router = useRouter()
  const cta = CONFIG.recruitCTA
  const { dismissed, dismiss } = useDismissible(STORAGE_KEY)

  // 홈에서만 노출
  if (router.pathname !== "/") return null
  if (!cta?.enabled || !cta.href || dismissed) return null

  const close = () => dismiss(HIDE_MS)

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
        className="absolute right-2 top-1/2 z-10 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-colors hover:bg-white/25"
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
