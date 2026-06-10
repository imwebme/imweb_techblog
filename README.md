# 아임웹 테크

Notion 을 CMS 로 사용하는 정적 사이트입니다. GitHub Pages 로 배포됩니다.

> 📚 함께 보기: [STRUCTURE.md](./STRUCTURE.md) (프로젝트 구조) · [REQUIREMENTS.md](./REQUIREMENTS.md) (요구사항) · [DEPLOY.md](./DEPLOY.md) (운영·배포)

## 핵심 특징

- **notion-client(비공식 Notion API) 기반 데이터 페치** — 토큰 불필요. 노션 DB 가 "웹에 게시" 되어 있으면 빌드 시 자동으로 가져옵니다. 글 개수 제한 없이 전체를 가져옵니다(`collectionReducerLimit`).
- **고정형 배너 + 좌측 카테고리·태그 사이드바 + 카드/리스트 토글이 있는 글 목록** 메인 레이아웃, Pretendard 한글 타이포. 헤더 로고는 SVG, 푸터는 좁은 화면에서 2열로 정렬됩니다. 그리드·리스트 썸네일은 모두 **16:10 고정**(카드에 여백 없이 flush). 리스트 뷰의 썸네일은 **sm 이상에서 우측**에 배치돼 시선 균형을 맞춥니다.
- **페이지네이션** — 글 목록을 한 페이지당 9개(`PAGE_SIZE`)로 나눠 번호 페이지네이션(`‹ 1 2 3 … ›`)을 제공합니다. 카테고리·태그 필터 결과에도 그대로 적용되고, 필터를 바꾸면 1페이지로 초기화됩니다.
- **반응형 헤더** — 좁은 화면(`< 640px`)에선 네비 링크를 햄버거 메뉴로 접고 그 자리에 검색바를 노출, 넓은 화면에선 인라인 네비 + 고정폭 검색을 사용합니다.
- **다크모드** — 헤더 토글(해/달)로 라이트/다크 전환. **기본은 라이트**이고, 토글로 다크를 선택하면 `localStorage` 에 기억합니다. `darkMode: "class"` + CSS 변수 팔레트(`:root`/`.dark`) 기반이라 컴포넌트마다 `dark:` 를 붙이지 않아도 됩니다. 로고도 라이트=검정/다크=흰색 SVG 로 자동 전환되고, giscus 댓글 테마도 연동됩니다.
- **`react-notion-x`** 로 본문 블록(코드/콜아웃/이미지/수식) 렌더링 — 콜아웃·인용구·제목·인라인코드 등을 블로그 톤앤매너에 맞춰 커스텀 스타일링(`globals.css`, 라이트/다크 모두 대응).
- **커버/썸네일 graceful fallback** — 미설정이거나 외부 이미지 로드 실패(404) 시, 제목 이니셜이 들어간 그라데이션 placeholder 로 자동 대체(`CoverImage`).
- **검색** — 제목·요약·카테고리·태그 substring 매치 (`/search?q=...`).
- **댓글** — giscus (GitHub Discussions 기반, GitHub 계정 로그인).
- **공유** — Web Share API + 클립보드 복사 fallback.
- **채용 CTA 전광판** — 화면 하단 고정 LED 마퀴(좌→우 흐름, 파란 네온 글로우 + 로고 구분자)로 채용 이벤트를 상시 노출. `site.config.js` 의 `recruitCTA` 토글로 켜고 끄며 문구·링크를 바꿉니다. 방문자가 닫으면(X) 기억됩니다.
- **메인 페이지 이벤트 팝업** — 개발자 행사 등 홍보용 모달. 메인(`/`)에서만 노출되며 `site.config.js` 의 `eventPopup` 으로 토글/배너 이미지/타이틀/일시·장소/CTA 링크를 관리합니다. `image` 필드가 있으면 모달 상단에 풀폭 배너가 들어가고, 이미지 비율은 자동으로 맞춰집니다(16:9, OG 40:21, 1:1 등 자유). "오늘 하루 보지 않기" 누르면 그날 자정까지(캘린더 기준 "오늘") 안 뜨고, 다음 날 다시 노출됩니다.
- **Google Analytics 4** — 동의 배너 없이 모든 방문에 대해 `gtag` 스크립트가 로드됩니다(전수 집계). 측정 ID 는 `site.config.js` 의 `analytics.measurementId` 에서 관리하며, `analytics.enabled: false` 로 끌 수 있습니다.
- **SEO 구조화 데이터** — 모든 페이지에 `schema.org/WebSite` (별칭·검색액션) + `schema.org/Organization` JSON-LD 가 박힙니다. 검색 별칭(`아임웹 기술블로그` 등)은 `site.config.js` 의 `blog.alternateNames` 에서 관리합니다.
- **Next.js 14 정적 export** → GitHub Pages 정적 호스팅.
- **GitHub Actions 자동 빌드/배포** + 30분 cron 재빌드로 Notion 변경사항 반영. 노션 API 가 일시적으로 5xx 를 돌려주면 자동 재시도, 영구 실패 시에는 "잠시만 기다려주세요" 안내 화면으로 graceful fallback.

## 빠른 시작

```bash
npm install
npm run dev
```

http://localhost:3000 접속. 별도의 환경 변수 없이 바로 동작합니다 (노션 DB 가 "웹에 게시" 되어 있다는 전제).

### 정적 빌드

```bash
npm run build
```

`./out` 디렉토리에 정적 사이트가 생성됩니다.

### 테스트 / 검사

```bash
npm test          # vitest — 노션 파싱/스냅샷 등 순수 로직 단위 테스트
npm run type-check # tsc --noEmit
npm run lint       # next lint
```

노션 파싱(`mapPage`)·글 목록 스냅샷(`getPosts`)·slug 변환 로직을 단위 테스트로 검증합니다.

## Notion 데이터베이스 스키마

코드는 아래 속성명을 자동으로 인식합니다 (대소문자 무시, 한글 alias 도 함께 지원).

| 속성       | 타입         | Alias                            | 비고                                                       |
| ---------- | ------------ | -------------------------------- | ---------------------------------------------------------- |
| title      | Title        | (필수)                           | 글 제목                                                    |
| slug       | Text         | `slug`, `url`                    | URL 의 일부. 비워두면 title 을 자동 변환                   |
| status     | Select       | `status`, `상태`                 | `Public` 만 노출. `PublicOnDetail` 등은 빌드에서 제외       |
| category   | Multi-select | `category`, `카테고리`           | 좌측 사이드바 카테고리 필터에 사용. 한 글이 여러 카테고리에 속할 수 있음 |
| tags       | Multi-select | `tags`, `태그`                   | 좌측 사이드바 태그 필터에 사용                             |
| summary    | Text         | `summary`, `description`, `요약` | 카드/메타 description 에 사용                              |
| date       | Date         | `date`, `published`, `발행일`    | 미설정 시 페이지 생성일 사용                               |
| thumbnail  | File         | `thumbnail`, `cover`, `썸네일`   | 카드 썸네일. 노션 신형 첨부(attachment:) 는 미지원 — [이미지 가이드](#카드-썸네일--커버-이미지) 참고 |
| author     | Person       | `author`, `authors`, `작성자`    | 카드/상세 페이지에 표시 (선택)                              |

> 속성명 뒤에 운영 메모를 붙여도 인식됩니다 (예: `tags(최대 3개)` → 정상적으로 `tags` 로 매핑).

## 카드 썸네일 / 커버 이미지

노션의 신형 attachment 업로드(`attachment:<uuid>:<file>`) 는 비공식 API 로 풀어낼 수 없으므로 다음 두 방법 중 하나로 사용합니다.

1. **레포에 이미지 커밋 (권장)**: 이미지를 [`public/post-images/`](./public/post-images/) 에 올린 뒤, 노션 `thumbnail` 컬럼에 사이트 URL 임베드. 예: `https://tech.imweb.me/post-images/<파일명>`
2. **외부 URL**: Unsplash 등 외부 호스팅의 URL 을 그대로 임베드

## 디자인 커스터마이징

대부분의 값은 [`site.config.js`](./site.config.js) 한 파일에서 변경할 수 있습니다.

- 사이트 제목/설명/URL
- 브랜드 컬러
- 네비게이션 메뉴
- Notion 데이터베이스 ID
- 회사 정보(푸터)
- 댓글(giscus) 설정
- 채용 CTA(recruitCTA) — 노출 여부/문구/링크
- 이벤트 팝업(eventPopup) — 노출 여부/배너 이미지/타이틀·설명·일시·장소·신청 링크
- 분석(analytics) — GA4 측정 ID 와 활성 여부

Tailwind 토큰은 [`tailwind.config.js`](./tailwind.config.js) 에, 본문(`.notion` 하위)/카드(`.lift-card`)/칩(`.chip`)/CTA 마퀴(`.cta-led`·`.cta-marquee-track`)/이벤트 팝업(`.event-popup-card`) 스타일은 [`src/styles/globals.css`](./src/styles/globals.css) 에서 조정합니다.

라이트/다크 색상은 모두 `globals.css` 의 CSS 변수로 관리합니다 — `:root`(라이트)와 `.dark`(다크) 블록의 `--color-*` 값만 바꾸면 전체 팔레트가 전환됩니다. 헤더 로고는 [`public/Logo_ImwebTech_black.svg`](./public/) / [`Logo_ImwebTech_white.svg`](./public/), OG 기본 이미지는 [`public/OG_imweb_tech.png`](./public/) 를 사용합니다.

## GitHub Pages 배포

1. 노션 DB 페이지에서 `Share` → `Publish` → "Publish to web" 활성화
2. 저장소 Settings → Pages → **Source** 를 `GitHub Actions` 로 설정
3. `main` 브랜치에 push 하면 `.github/workflows/deploy.yml` 이 자동으로 `next build` 후 `./out` 을 GitHub Pages 에 배포
4. 30분 cron 으로 자동 재빌드되어 Notion 변경 사항이 반영됨 (필요 시 워크플로우의 `cron` 라인 조정)

별도의 시크릿(`NOTION_TOKEN` 등) 등록은 필요 없습니다.

자세한 절차는 [DEPLOY.md](./DEPLOY.md) 참고.

### 도메인 / basePath

운영 도메인은 [`tech.imweb.me`](https://tech.imweb.me) (CNAME: [`public/CNAME`](./public/CNAME)). GitHub Pages 의 `actions/configure-pages` 가 커스텀 도메인을 감지하면 `BASE_PATH` 가 빈 문자열로 주입되고, `next.config.js` 는 이를 그대로 사용합니다. 커스텀 도메인을 떼면 자동으로 `/imweb_techblog` 프로젝트 페이지로 폴백합니다.

`<owner>.github.io` 사용자 페이지로 옮기려면 CNAME 을 지우고 `BASE_PATH=""` 를 명시한 뒤 저장소 이름을 `<owner>.github.io` 로 바꾸면 됩니다.

## 라이선스

MIT.
