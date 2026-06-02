// 사이트 전역 설정. 운영중에는 이 파일만 수정해도 대부분의 항목을 변경할 수 있습니다.
const CONFIG = {
  // ── 사이트 기본 정보 ──────────────────────────────────────────────────────
  blog: {
    title: "아임웹 테크",
    description: "아임웹 기술 조직의 이야기를 담습니다.",
    author: "Imweb Tech",
    language: "ko-KR",
    timezone: "Asia/Seoul",
    siteUrl: "https://imwebme.github.io/imweb_techblog",
  },

  // ── 브랜드 컬러 ─────────────────────────────────────────────────────────
  // 차분한 흑백 + 강한 포커스 블루.
  brand: {
    primary: "#3182F6", // 브랜드 블루
    primaryDark: "#1B64DA",
    accent: "#0064FF",
    text: "#191F28",
    subtext: "#4E5968",
    muted: "#8B95A1",
    surface: "#F9FAFB",
    border: "#E5E8EB",
    background: "#FFFFFF",
  },

  // ── Notion 연동 ──────────────────────────────────────────────────────────
  // notion-client (비공식 API). 토큰 불필요. DB 가 "Publish to web" 되어 있어야 함.
  notion: {
    // URL 의 `09870e1112ce83098f628118b6ba9bb3` 부분이 데이터베이스 ID 입니다.
    databaseId:
      process.env.NOTION_DATABASE_ID || "09870e1112ce83098f628118b6ba9bb3",
  },

  // ── 네비게이션 ───────────────────────────────────────────────────────────
  // external: true 면 새 탭으로 엽니다(외부 URL).
  nav: [
    { label: "글", href: "/" },
    { label: "채용", href: "https://career.imweb.me", external: true },
    { label: "개발자센터", href: "https://developers.imweb.me/", external: true },
  ],

  // ── 외부 링크 / 푸터 ────────────────────────────────────────────────────
  social: {
    homepage: "https://imweb.me",
    careers: "https://career.imweb.me",
    contactEmail: "tech@imweb.me",
  },

  // ── 회사 정보 (푸터 노출) ───────────────────────────────────────────────
  company: {
    name: "(주)아임웹",
    ceo: "이수모",
    privacyOfficer: "김형섭",
    businessNumber: "105-87-83592",
    ecommerceNumber: "제 2023-서울강남-02377",
    address: "서울 강남구 테헤란로 501 VPLEX",
  },

  // ── 댓글 (giscus) ───────────────────────────────────────────────────────
  // 1) 레포 Settings → General → Features → Discussions 활성화
  // 2) https://github.com/apps/giscus 설치 (해당 레포에 접근 권한 부여)
  // 3) https://giscus.app 에서 설정 마법사로 repoId / categoryId 받기
  // 4) 아래 값 채우고 enabled: true 로 변경
  comments: {
    giscus: {
      // repo 비공개 전환 시 Discussions 가 외부에 안 보이므로 일시 비활성화.
      // 팀 repo 이전 후 새 repo 에 giscus 재설치하고 다시 true 로.
      enabled: false,
      repo: "imwebme/imweb_techblog",
      // ↓ 새 repo 에 giscus 재설치 후 https://giscus.app 에서 발급받아 갱신 필요
      // repoId/categoryId 는 옛 값이므로 enabled: true 로 켜기 전 반드시 교체
      repoId: "R_kgDOScKclg",
      category: "General",
      categoryId: "DIC_kwDOScKcls4C9BhC",
      mapping: "pathname", // 페이지 경로를 discussion 과 매핑
      lang: "ko",
      reactionsEnabled: "1",
      inputPosition: "bottom",
    },
  },

  // ── 채용 이벤트 CTA (상단 리본) ──────────────────────────────────────────
  // 이벤트 기간에만 enabled: true. label/href 만 바꿔 운영합니다.
  recruitCTA: {
    enabled: true, // 이벤트 끝나면 false
    label: "아임웹은 지금 채용 중! 보상금 100만 원",
    href: "https://career.imweb.me",
  },

  // ── 메인 페이지 이벤트 팝업 ─────────────────────────────────────────────
  // 개발자 행사 등 홍보용. enabled: false 면 안 뜸. 메인(/)에서만 노출.
  // 사용자가 "오늘 하루 보지 않기" 누르면 24시간 동안 안 보임(localStorage).
  eventPopup: {
    enabled: false,
    badge: "DEV EVENT",
    title: "아임웹 테크 데이 2026",
    description:
      "아임웹의 첫번째 외부 행사에 초대합니다.\n키노트부터 기술 세션, 네트워킹까지 많은 기대 부탁드립니다.",
    date: "2026.07.15 (수) · 14:00",
    place: "서울 강남 VPLEX 9F",
    ctaLabel: "지금 신청하기",
    ctaHref: "https://career.imweb.me",
  },
}

module.exports = CONFIG
