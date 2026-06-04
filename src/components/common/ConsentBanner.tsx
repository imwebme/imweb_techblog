import { useConsent } from "@/lib/useConsent"

const CONFIG = require("../../../site.config")

// 분석 쿠키 동의 배너. analytics.enabled 가 켜져 있을 때만,
// 그리고 사용자가 아직 선택하지 않은 경우(pending)에만 노출됩니다.
// hydrated 가 끝나기 전에는 깜빡임 방지를 위해 그리지 않습니다.
//
// 디자인: 하단 고정, 좁은 화면에선 세로로 쌓이고 wide 에선 한 줄.
// RecruitRibbon (하단 고정) 과 겹치지 않도록 z-index 는 더 높게,
// 배너가 보일 때 RecruitRibbon 은 bottom 오프셋이 자동으로 밀리도록
// RecruitRibbon 쪽에서 처리하지 않고, 단순히 배너를 그 위에 띄웁니다.
export default function ConsentBanner() {
  const cfg = CONFIG.analytics
  const { status, hydrated, grant, deny } = useConsent()

  if (!cfg?.enabled) return null
  if (!hydrated) return null
  if (status !== "pending") return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="쿠키 사용 동의"
      className="fixed inset-x-3 bottom-3 z-[70] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md"
    >
      <div className="rounded-xl border border-line bg-card p-4 shadow-2xl sm:p-5">
        <p className="text-sm leading-relaxed text-ink-700">
          이 사이트는 방문자 통계 분석을 위해{" "}
          <span className="font-semibold text-ink-900">Google Analytics</span> 쿠키를 사용합니다.
          개인을 식별하는 정보는 수집하지 않으며, 거부하셔도 사이트 이용에는 영향이 없습니다.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={deny}
            className="rounded-lg px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-surface"
          >
            거부
          </button>
          <button
            type="button"
            onClick={grant}
            className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-base transition-opacity hover:opacity-90"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  )
}
