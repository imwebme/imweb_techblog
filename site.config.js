// 사이트 전역 설정. 운영중에는 이 파일만 수정해도 대부분의 항목을 변경할 수 있습니다.
const CONFIG = {
  // ── 사이트 기본 정보 ──────────────────────────────────────────────────────
  blog: {
    title: "아임웹 테크",
    // SEO 별칭 — JSON-LD schema:WebSite#alternateName 으로 노출.
    // 사용자가 검색할 만한 표현을 모아둡니다.
    alternateNames: ["아임웹 기술블로그", "아임웹 기술 블로그", "Imweb Tech Blog"],
    description: "아임웹 기술블로그 — 기술 조직의 이야기를 담습니다.",
    author: "Imweb Tech",
    language: "ko-KR",
    timezone: "Asia/Seoul",
    siteUrl: "https://tech.imweb.me",
  },

  // ── SEO ─────────────────────────────────────────────────────────────────
  seo: {
    // 슬러그를 바꾼 글의 "옛 슬러그 → 새 슬러그" 매핑.
    //
    // 정적 배포(GitHub Pages)라 서버 301 을 쓸 수 없으므로, 빌드 시 옛 경로에
    // canonical + meta refresh 스텁 페이지를 생성해 리다이렉트를 대신합니다.
    // 이렇게 해야 이미 공유된 링크(링크드인 등)와 검색 색인이 404 로 끊기지 않고
    // 새 글로 이어집니다.
    //
    // 경로가 아니라 "슬러그"만 적습니다. (예: /posts/foo/ → "foo")
    // 대상 슬러그가 없거나 살아있는 글과 이름이 겹치면 빌드 시 건너뛰고 경고합니다.
    slugAliases: {
      // 2026-07-21 개명 — 슬러그·제목 동시 변경
      "legacy-to-verifiable-stage": "build-stage-ai-native",
      "eks-11-clusters-upgrade": "eks-11clusters-upgrade",
      // 오타 슬러그로 공유된 링크 구제
      "eks-11-clusters-upgrad": "eks-11clusters-upgrade",
    },
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
    { label: "채용", href: "https://team.imweb.me/career?utm_source=techblog&utm_medium=blog", external: true },
    { label: "개발자센터", href: "https://developers.imweb.me/", external: true },
  ],

  // 상단 메뉴 왼쪽의 강조 배지 (이벤트 신청 안내 등). 새 탭으로 열린다.
  // PC 는 메뉴 왼쪽, 모바일은 햄버거 메뉴 맨 위에 노출.
  // 이벤트가 끝나면 eventPopup 과 함께 enabled: false 로 내린다.
  headerBadge: {
    enabled: true,
    label: "TECH GROUND26 신청 중!",
    href: "https://ticketa.co/event/qexwz60x",
    // 이벤트 배너 톤에 맞춘 색. 비우면 브랜드 블루 배경 + 흰 글자.
    // (TECH GROUND 26 배너에서 추출: 배경 초록 / 등고선·정보 박스 청록)
    background: "#002c00",
    color: "#00c2ff",
  },

  // ── 외부 링크 / 푸터 ────────────────────────────────────────────────────
  social: {
    homepage: "https://imweb.me",
    careers: "https://team.imweb.me/career?utm_source=techblog&utm_medium=blog",
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

  // ── 분석 (Google Analytics 4) ───────────────────────────────────────────
  // 동의 배너 없이 모든 방문에 대해 gtag 를 로드합니다(전수 집계).
  // 측정 ID 는 GA4 → 관리 → 데이터 스트림에서 발급(`G-XXXXXXXXXX`).
  // enabled: false 면 로드 안 함.
  analytics: {
    enabled: true,
    measurementId: "G-B0EJFYJCZ9",
  },

  // ── 댓글 (giscus) ───────────────────────────────────────────────────────
  // 1) 레포 Settings → General → Features → Discussions 활성화
  // 2) https://github.com/apps/giscus 설치 (해당 레포에 접근 권한 부여)
  // 3) https://giscus.app 에서 설정 마법사로 repoId / categoryId 받기
  // 4) 아래 값 채우고 enabled: true 로 변경
  comments: {
    giscus: {
      enabled: true,
      repo: "imwebme/imweb_techblog",
      repoId: "R_kgDOSgbfZg",
      category: "General",
      categoryId: "DIC_kwDOSgbfZs4C-UKJ",
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
    href: "https://team.imweb.me/career?utm_source=techblog&utm_medium=blog",
  },

  // ── 메인 페이지 이벤트 팝업 ─────────────────────────────────────────────
  // 개발자 행사 등 홍보용. enabled: false 면 안 뜸. 메인(/)에서만 노출.
  // 사용자가 "오늘 하루 보지 않기" 누르면 그날 자정까지 안 보임(localStorage).
  eventPopup: {
    // TECH GROUND 26 공지 중 (2026-10-23 오픈). 이벤트가 끝나면 false 로 내린다.
    enabled: true,
    image: "/techground26_banner.webp",
    badge: "EVENT",
    title: "TECH GROUND 26",
    // whitespace-pre-line 으로 렌더되므로 \n 이 줄바꿈으로 그대로 보인다.
    description:
      "선 넘는 개발자들의 이야기\n아임웹의 첫 번째 오프라인 기술 밋업에 초대합니다.",
    date: "2026.11.18 (수) 19:00 – 22:00",
    place: "서울시 강남구 테헤란로 501, 15층",
    ctaLabel: "지금 신청하기",
    ctaHref: "https://ticketa.co/event/qexwz60x",
  },
}

module.exports = CONFIG
