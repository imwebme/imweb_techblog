import { withBasePath } from "@/lib/utils/withBasePath"

// 메인 페이지 상단 고정형 배너. 카테고리 / 최근 글 위에 위치합니다.
export default function Banner() {
  return (
    <section className="mb-8 sm:mb-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath("/banner_official_2400_405.png")}
        alt="아임웹 테크 — 기술 장벽을 낮춰 누구나 도전할 수 있는 세상을 만듭니다"
        className="w-full h-auto rounded-card"
        loading="eager"
      />
    </section>
  )
}
