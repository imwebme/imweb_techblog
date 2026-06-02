# 아임웹 테크 — 프로젝트 구조

> 새로 합류한 개발자/기획자가 5분 안에 파악할 수 있도록 작성된 구조 안내서.
>
> 다른 문서: [REQUIREMENTS.md](./REQUIREMENTS.md) (요구사항) / [DEPLOY.md](./DEPLOY.md) (운영) / [README.md](./README.md) (개요)

---

## 1. 한 줄 요약

**노션 DB → notion-client 로 fetch → Next.js 가 정적 HTML 생성 → GitHub Pages 호스팅**

토큰 없는 비공식 API 를 사용하므로 노션 DB 가 "Publish to web" 되어 있어야 합니다.

---

## 2. 기술 스택

| 영역 | 기술 |
|---|---|
| Framework | **Next.js 14** (`output: "export"` 로 정적 export) |
| 언어 | TypeScript + React 18 |
| 스타일 | Tailwind CSS + CSS 변수 토큰 (`globals.css`) |
| 테마 | **라이트/다크 모드** (`darkMode: "class"` + CSS 변수, 토글 + OS 추종) |
| 폰트 | Pretendard (한글) |
| 데이터 | **notion-client** (비공식 Notion API) |
| 본문 렌더 | **react-notion-x** + Prism (코드) + KaTeX (수식) |
| 댓글 | **giscus** (GitHub Discussions, 테마 연동) |
| 호스팅 | GitHub Pages + GitHub Actions |

---

## 3. 디렉터리 구조

```
imweb_techblog/
├── public/
│   ├── banner.webp                  메인 상단 슬로건 배너
│   ├── Logo_ImwebTech_black.svg      헤더 로고 (라이트 모드)
│   ├── Logo_ImwebTech_white.svg      헤더 로고 (다크 모드)
│   ├── symbol.webp                  favicon (구름 심볼)
│   ├── symbol_white.png             흰색 심볼 (채용 CTA 구분자)
│   ├── OG_imweb_tech.png            OG 기본 이미지
│   ├── robots.txt
│   ├── .nojekyll                    GitHub Pages 가 Jekyll 처리 건너뛰게
│   └── post-images/                 노션 thumbnail 직접 호스팅 (attachment 우회)
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── CoverImage.tsx       커버/썸네일 (미설정·404 시 placeholder fallback; 기본 그라데이션 내장)
│   │   ├── home/
│   │   │   ├── Banner.tsx           메인 상단 고정 배너
│   │   │   ├── Sidebar.tsx          카테고리/태그 필터 (lg+ sticky 좌측, < lg 토글)
│   │   │   ├── PostGrid.tsx         글 목록 + 그리드/리스트 뷰 토글 + 페이지네이션(9개/페이지)
│   │   │   ├── PostCard.tsx           ↳ 그리드 뷰의 카드 (썸네일 16:10)
│   │   │   ├── PostListItem.tsx       ↳ 리스트 뷰의 행 (썸네일 16:10, 카드에 flush, <sm 은 썸네일 숨김)
│   │   │   └── EventPopup.tsx       메인 페이지 이벤트 홍보 팝업 (eventPopup 토글)
│   │   ├── layout/
│   │   │   ├── Header.tsx           로고(SVG) + 네비 + 검색 + 테마 토글 (<sm 은 햄버거+검색바)
│   │   │   ├── ThemeToggle.tsx      라이트/다크 전환 버튼
│   │   │   ├── RecruitRibbon.tsx    채용 CTA 하단 고정 LED 마퀴 (recruitCTA 토글)
│   │   │   ├── Footer.tsx           메뉴 + 회사 정보 + 저작권 (좁은 화면 2열)
│   │   │   └── Layout.tsx           페이지 wrapper
│   │   └── post/
│   │       ├── PostHeader.tsx       제목·메타·태그·커버
│   │       ├── PostContent.tsx      <NotionRenderer /> 래핑
│   │       ├── PostActions.tsx      공유 버튼
│   │       └── Comments.tsx         giscus 임베드 (테마 연동)
│   │
│   ├── lib/
│   │   ├── notion/
│   │   │   ├── client.ts            NotionAPI 인스턴스 (내부), fetchPage / fetchUsers 헬퍼
│   │   │   ├── getPosts.ts          DB → TPost[] (목록, 카테고리/태그 집계)
│   │   │   ├── getPostBySlug.ts     단일 글 → TPost + recordMap
│   │   │   ├── mapPage.ts           notion block → TPost 매핑 (속성 파싱)
│   │   │   └── enrichUsers.ts       공개 페이지의 빈 notion_user 보강
│   │   ├── utils/
│   │   │   ├── formatDate.ts        "2026-05-13" → "2026.05.13"
│   │   │   ├── slugify.ts           제목 → URL slug
│   │   │   ├── safeAsync.ts         getStaticProps try/catch + fallback 헬퍼
│   │   │   └── withBasePath.ts      GitHub Pages basePath 자동 prefix
│   │   ├── useTheme.ts              라이트/다크 테마 훅 (토글·localStorage, 기본 라이트)
│   │   └── useDismissible.ts        공용 닫기 훅 — localStorage 영구/TTL 기억 (RecruitRibbon·EventPopup 공유)
│   │
│   ├── pages/
│   │   ├── _app.tsx                 전역 CSS, OG meta
│   │   ├── _document.tsx
│   │   ├── 404.tsx
│   │   ├── index.tsx                메인 (홈)
│   │   ├── about.tsx                소개
│   │   ├── search.tsx               검색 결과 (?q=...)
│   │   ├── tags.tsx                 태그 목록
│   │   └── posts/[slug].tsx         글 상세
│   │
│   ├── styles/globals.css           Tailwind base + CSS 변수 팔레트(:root/.dark) + .notion 본문 스타일 + .chip 등
│   └── types/index.ts               TPost / TAuthor / TPostStatus
│
├── scripts/
│   └── build-feed-and-sitemap.ts    postbuild — RSS/Atom/sitemap 생성
├── .github/workflows/deploy.yml     CI: build + Pages 배포
├── next.config.js                   output: "export", basePath, image config
├── tailwind.config.js               컬러/타이포/easing 토큰
├── tsconfig.json
├── package.json
└── site.config.js                   ★ 운영 설정 (블로그명/메뉴/회사정보/giscus)
```

> **운영 중 자주 만지는 파일은 굵게 표시한 `site.config.js` 하나입니다.**

---

## 4. URL / 페이지 구조

| 경로 | 파일 | 설명 |
|---|---|---|
| `/` | `pages/index.tsx` | 메인. 배너 + 사이드바(필터) + 전체 글 목록 |
| `/posts/<slug>/` | `pages/posts/[slug].tsx` | 글 상세. 헤더 + 본문 + 공유 + 댓글 |
| `/tags/` | `pages/tags.tsx` | 모든 태그를 칩으로 나열 |
| `/search/?q=...` | `pages/search.tsx` | 클라이언트 사이드 substring 검색 |
| `/about/` | `pages/about.tsx` | 소개 |
| `/404` | `pages/404.tsx` | Not Found |

빌드 산출물 (`scripts/build-feed-and-sitemap.ts`):

| 경로 | 설명 |
|---|---|
| `/feed.xml` | RSS 2.0 (최근 20개 글) |
| `/atom.xml` | Atom 1.0 |
| `/sitemap.xml` | 모든 페이지 + 글 목록 |

외부 링크 (네비):
- 채용 → https://career.imweb.me
- 개발자센터 → https://developers.imweb.me

---

## 5. 데이터 흐름

```mermaid
flowchart LR
  N["Notion DB<br/>(웹에 게시)"]
  C["notion-client<br/>fetchPage()"]
  E["enrichUsers<br/>(작성자 보강)"]
  M["mapPage<br/>(속성 → TPost)"]
  GP["getPosts<br/>getCategories<br/>getTags"]
  GPS["getPostBySlug<br/>(+ recordMap)"]
  SP["getStaticProps /<br/>getStaticPaths"]
  H["정적 HTML<br/>(./out)"]
  GH["GitHub Pages"]

  N --> C
  C --> E
  E --> M
  M --> GP
  M --> GPS
  GP --> SP
  GPS --> SP
  SP --> H
  H --> GH
```

**핵심 포인트**
- `notion-client` 호출은 build-time + dev request 시점에 일어남 (런타임 X)
- 일시적 502/네트워크 에러는 retry 3회 자동 재시도 후, 영구 실패 시 `safeAsync()` 로 빈 상태 UI (`잠시만 기다려주세요.`) graceful fallback
- 공개 게시된 페이지에는 `notion_user` 가 비어있어 `enrichUsers` 가 별도 fetch 로 채워줌

---

## 6. 컴포넌트 트리

### 홈 (`/`)

```
Layout
├── Header                  로고(SVG) / 네비(또는 햄버거+검색바, <sm) / 검색 / 테마 토글
├── EventPopup              메인 전용 이벤트 홍보 모달 (eventPopup 활성 시)
├── HomePage
│   ├── Banner              상단 슬로건 이미지
│   ├── Sidebar             카테고리 / 태그 필터
│   │   ├── DesktopFilters  (lg+) sticky 좌측 vertical 리스트
│   │   └── NarrowFilters   (< lg) 토글 + 2컬럼 칩
│   └── PostGrid            글 목록 + 페이지네이션
│       ├── ViewToggle      그리드/리스트 토글 버튼
│       ├── PostCard*       (grid 모드)
│       ├── PostListItem*   (list 모드, 기본; <sm 은 썸네일 숨김)
│       └── Pagination      ‹ 1 2 3 … › (글 수 > 9 일 때)
├── Footer
└── RecruitRibbon           하단 고정 LED 마퀴 (recruitCTA 활성 시, 모든 페이지)
```

### 글 상세 (`/posts/<slug>/`)

```
Layout
├── Header
├── PostHeader              카테고리 라벨 / 제목 / 요약 / 작성자·날짜 / 태그 칩 / 커버
├── PostContent             <NotionRenderer /> + dynamic Code/Collection/Equation/Modal
├── PostActions             공유 버튼 (Web Share API + clipboard fallback)
├── Comments                giscus (활성 시, 테마 연동)
├── Footer
└── RecruitRibbon           하단 고정 LED 마퀴 (recruitCTA 활성 시)
```

---

## 7. 노션 데이터베이스 스키마

| 속성 | 타입 | 필수 | 비고 |
|---|---|---|---|
| `title` | Title | ✅ | 글 제목 |
| `slug` | Text | 권장 | URL 의 일부. 영문 소문자 + 하이픈 |
| `status` | Select | ✅ | `Public` 만 노출. `PublicOnDetail` 등은 빌드 제외 |
| `category` | Multi-select | 권장 | 사이드바 카테고리 (옵션 정의 순서 유지, 한 글에 여러 카테고리 가능) |
| `tags` | Multi-select | 선택 | 사이드바 태그 |
| `summary` | Text | 권장 | 카드/메타 description |
| `date` | Date | 권장 | 발행일 (정렬 키) |
| `thumbnail` | File | 선택 | 카드 썸네일. 노션 신형 attachment 는 미노출 — `public/post-images/` 권장 |
| `author` | Person | 선택 | 카드/상세에 표시 |

---

## 8. 빌드 / 배포 파이프라인

```mermaid
flowchart TB
  T1["main 브랜치 push"]
  T2["30분 cron"]
  T3["수동 Run workflow"]
  T1 --> A
  T2 --> A
  T3 --> A
  A["GitHub Actions<br/>(deploy.yml)"]
  A --> I["npm ci"]
  I --> B["next build<br/>(출력: ./out)"]
  B --> PB["postbuild<br/>(feed/sitemap 생성)"]
  PB --> AR["upload-pages-artifact"]
  AR --> D["deploy-pages"]
  D --> GH["https://imwebme.github.io/imweb_techblog/"]
```

**트리거**
- `push: branches: [main]`
- `schedule: cron "*/30 * * * *"` — 30분마다 (노션 변경 자동 반영)
- `workflow_dispatch` — Actions 탭에서 수동

---

## 9. 디자인 시스템 (간단)

### 컬러 / 토큰 (`globals.css`)

색상은 모두 CSS 변수로, `:root`(라이트)와 `.dark`(다크) 두 블록에서 값만 전환합니다. Tailwind 의 `ink/surface/line/base/card` 색상이 이 변수를 참조하므로 컴포넌트는 그대로 두고 변수만 바꾸면 됩니다.

| 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `--color-brand` | `#3182F6` | `#3182F6` | 포커스 / 강조 (공통) |
| `--color-bg` | `#FFFFFF` | `#0F1115` | 페이지 배경 (`bg-base`) |
| `--color-card` | `#FFFFFF` | `#181B20` | 카드/입력 표면 (`bg-card`) |
| `--color-surface` | `#F9FAFB` | `#1F242B` | 칩/보조 배경 (`bg-surface`) |
| `--color-text` | `#191F28` | `#E7EAEE` | 본문 (`text-ink-900`) |
| `--color-subtext` | `#4E5968` | `#A7B0BC` | 보조 (`text-ink-700`) |
| `--color-border` | `#E5E8EB` | `#2A2F37` | 구분선 (`border-line`) |
| `--ease-smooth` | `cubic-bezier(0.16, 1, 0.3, 1)` | — | hover/transition |

### 다크 모드

- `tailwind.config.js` → `darkMode: "class"`. `<html class="dark">` 여부로 전환.
- `_document.tsx` 의 인라인 스크립트가 페인트 전에 `localStorage.theme` 을 읽어 클래스를 주입 → **FOUC 방지**. 저장값이 `dark` 일 때만 다크로 시작(**기본 라이트**).
- `ThemeToggle` + `useTheme()` 가 토글/저장/구독 담당. 헤더 로고(black/white SVG)와 giscus 테마가 모드에 따라 자동 전환.

### 재사용 클래스

| 클래스 | 사용처 |
|---|---|
| `.notion` 하위 | 본문(react-notion-x) 블록 — 콜아웃/인용구/제목/코드 등을 톤앤매너로 재정의 (라이트/다크 대응) |
| `.lift-card` | 카드 hover 시 그림자 + Y -4px |
| `.chip` | 태그/카테고리 칩 (`.is-active` 로 활성) |
| `.cta-marquee-track` / `.cta-led` / `.cta-led-logo` | 채용 CTA LED 전광판 — 좌→우 흐름 + 파란 네온 글로우 (`prefers-reduced-motion` 시 정지) |
| `.event-popup-card` | 메인 이벤트 팝업 등장 애니메이션 (페이드 + 스케일, reduced-motion 시 정지) |
| `.no-scrollbar` | 가로 스크롤 영역의 스크롤바 숨김 |

### 반응형 브레이크포인트

| 폭 | 적용 |
|---|---|
| `< 640px` | 카드 1열, 헤더는 햄버거 메뉴 + 검색바, 사이드바 토글, 푸터 2열, 리스트 뷰 썸네일 숨김(텍스트 전용) |
| `640~1024px` | 카드 2열, 인라인 네비 + 검색, 사이드바 토글 (펼치면 2컬럼) |
| `≥ 1024px` | 좌측 사이드바 (220px) + 본문, 카드 3열 |ㄹ

---

## 10. 핵심 설정 파일 요약

| 파일 | 책임 |
|---|---|
| **`site.config.js`** | 블로그명, 설명, 네비, 회사 정보, 노션 DB ID, giscus 설정, 채용 CTA(recruitCTA), 이벤트 팝업(eventPopup) |
| `next.config.js` | basePath (GitHub Pages), 정적 export, image unoptimized |
| `tailwind.config.js` | 컬러/타이포/이징 토큰 → Tailwind 유틸로 노출 |
| `.github/workflows/deploy.yml` | 빌드 + Pages 배포 (push / cron / 수동) |

---

## 11. 알려진 한계 / 자주 묻는 항목

| | 한계 | 우회 |
|---|---|---|
| 1 | 노션 신형 attachment 이미지 (`attachment:...`) 가 비공식 API 로 안 풀림 | `public/post-images/` 직접 호스팅 + 노션 thumbnail 에 GitHub Pages URL 임베드 |
| 2 | 검색이 본문은 포함하지 않음 | 제목/요약/카테고리/태그 substring 만 |
| 3 | dev 의 `getStaticPaths` 캐시 | 노션에 새 글 추가 후 dev 서버 재시작 |

> ※ "글 다수 시 누락" 은 `collectionReducerLimit`(client.ts) 로 전량 수집하도록 해결됨. 화면 목록은 `PostGrid` 가 9개/페이지로 나눠 보여줍니다(데이터 페치와 별개).
