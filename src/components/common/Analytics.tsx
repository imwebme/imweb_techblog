import { useEffect } from "react"
import Script from "next/script"
import { useRouter } from "next/router"
import { useConsent } from "@/lib/useConsent"

const CONFIG = require("../../../site.config")

// Google Analytics 4. PIPA opt-in 기준 — 동의 전에는 gtag 스크립트 자체를
// 마운트하지 않습니다 (cookieless 1st-party 가 아닌 한 분석/광고 쿠키도
// 명시 동의 대상). 동의 후엔 Pages Router 의 라우트 변경 이벤트마다
// page_view 를 수동으로 보냅니다 (자동 페이지뷰는 첫 로드만 잡힘).
//
// 거부 상태에선 아무 스크립트도 로드되지 않습니다.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export default function Analytics() {
  const { status } = useConsent()
  const router = useRouter()
  const cfg = CONFIG.analytics
  const enabled =
    !!cfg?.enabled && !!cfg?.measurementId && status === "granted"

  useEffect(() => {
    if (!enabled) return
    const onRouteChange = (url: string) => {
      window.gtag?.("event", "page_view", {
        page_path: url,
        page_location: window.location.origin + url,
      })
    }
    router.events.on("routeChangeComplete", onRouteChange)
    return () => {
      router.events.off("routeChangeComplete", onRouteChange)
    }
  }, [enabled, router.events])

  if (!enabled) return null

  const id = cfg.measurementId

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', {
            anonymize_ip: true,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  )
}
