# 아임웹 테크

Notion 을 CMS 로 사용하는 정적 사이트. GitHub Pages 로 배포됩니다.

> 📚 함께 보기: [STRUCTURE.md](./STRUCTURE.md) · [REQUIREMENTS.md](./REQUIREMENTS.md) · [DEPLOY.md](./DEPLOY.md)

## 핵심 특징

**콘텐츠 (Notion 기반)**

- **notion-client** — 비공식 Notion API, 토큰 불필요. DB 가 "웹에 게시" 만 되어 있으면 빌드 시 자동 페치 (개수 제한 없음)
- **react-notion-x** — 코드·콜아웃·이미지·수식 렌더링. 본문 톤앤매너 커스텀 (`globals.css`, 라이트/다크 대응)
- **검색** — 제목·요약·카테고리·태그 substring (`/search?q=...`)
- **graceful fallback** — 노션 5xx 자동 재시도, 영구 실패 시 "잠시만 기다려주세요" 안내. 썸네일 미설정·404 시 이니셜 그라데이션 placeholder

**사용자 경험**

- **메인 레이아웃** — 상단 배너 + 좌측 카테고리·태그 사이드바 + 카드/리스트 토글, Pretendard 한글 타이포
- **썸네일** — 그리드·리스트 모두 16:10 flush, 리스트는 sm 이상에서 우측 배치
- **페이지네이션** — 9개/페이지, 필터 변경 시 1페이지로 초기화
- **반응형 헤더** — `< 640px` 햄버거 메뉴 + 검색바, 그 외 인라인 네비
- **다크모드** — 헤더 토글, 기본 라이트, `localStorage` 기억. 로고·giscus 댓글 테마 자동 연동
- **댓글 / 공유** — giscus (GitHub Discussions 기반) / Web Share API + 클립보드 fallback

**운영 모듈·분석·인프라**

- **채용 CTA 전광판** — 하단 고정 LED 마퀴, `site.config.js` 의 `recruitCTA` 한 줄로 토글. 방문자 닫기 기억
- **이벤트 팝업** — 메인 전용 모달, 자유 비율 배너 이미지. "오늘 하루 보지 않기" 는 캘린더 자정 리셋
- **Google Analytics 4** — 전수 집계 (동의 배너 없음). `analytics.enabled` 로 토글
- **SEO 구조화 데이터** — 모든 페이지에 `schema.org/WebSite` + `Organization` JSON-LD. 검색 별칭은 `blog.alternateNames`
- **정적 배포** — Next.js 14 `output: "export"` → GitHub Actions → GitHub Pages. 30분 cron 으로 자동 재빌드

## 빠른 시작

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 정적 빌드 → ./out
npm test             # vitest — 노션 파싱/스냅샷
npm run type-check
npm run lint
```

환경 변수 불필요. 노션 DB 가 "웹에 게시" 되어 있다는 전제.

## Notion 데이터베이스 스키마

코드는 아래 속성명을 자동 인식 (대소문자 무시, 한글 alias 지원).

| 속성       | 타입         | Alias                            | 비고 |
| ---------- | ------------ | -------------------------------- | --- |
| title      | Title        | (필수)                           | 글 제목 |
| slug       | Text         | `slug`, `url`                    | URL. 비우면 title 자동 변환 |
| status     | Select       | `status`, `상태`                 | `Public` 만 노출 |
| category   | Multi-select | `category`, `카테고리`           | 사이드바 카테고리 (한 글 다중 분류 가능) |
| tags       | Multi-select | `tags`, `태그`                   | 사이드바 태그 |
| summary    | Text         | `summary`, `description`, `요약` | 카드 · OG description |
| date       | Date         | `date`, `published`, `발행일`    | 미설정 시 페이지 생성일 |
| thumbnail  | File         | `thumbnail`, `cover`, `썸네일`   | 카드 썸네일 ([이미지 가이드](#카드-썸네일)) |
| author     | Person       | `author`, `authors`, `작성자`    | 카드/상세 표시 |

> 속성명 뒤에 운영 메모를 붙여도 인식됩니다 (예: `tags(최대 3개)` → 정상적으로 `tags` 로 매핑).

## 카드 썸네일

노션 신형 attachment (`attachment:<uuid>:<file>`) 는 비공식 API 로 못 풉니다. 두 가지 우회:

1. **레포 직접 호스팅 (권장)** — `public/post-images/` 에 커밋 → 노션 `thumbnail` 컬럼에 URL 임베드. 예: `https://tech.imweb.me/post-images/<파일명>`
2. **외부 URL** — Unsplash 등 외부 호스팅 URL 그대로 임베드

## 디자인 커스터마이징

운영 중 자주 만지는 값은 한 파일에 모여있습니다.

| 파일 | 무엇을 |
|---|---|
| [`site.config.js`](./site.config.js) | 사이트 메타·네비·회사 정보·노션 DB·giscus·recruitCTA·eventPopup·analytics·alternateNames |
| [`tailwind.config.js`](./tailwind.config.js) | 컬러·타이포·이징 토큰 |
| [`src/styles/globals.css`](./src/styles/globals.css) | 본문/카드/칩/마퀴/팝업 스타일 + CSS 변수 팔레트 (`:root`/`.dark`) |
| [`public/Logo_ImwebTech_*.svg`](./public/) | 헤더 로고 (라이트=검정 / 다크=흰색) |
| [`public/OG_imweb_tech.png`](./public/) | OG 기본 이미지 |

## 배포

1. 노션 DB `Share` → `Publish` → "Publish to web" 활성화
2. 저장소 Settings → Pages → Source `GitHub Actions`
3. `main` 푸시하면 자동 빌드 → 배포. 30분 cron 으로 노션 변경 자동 반영

도메인·basePath·검색 노출 등 자세한 절차는 [DEPLOY.md](./DEPLOY.md) 참고.

## Contact

아임웹 Developer Relations  
[tech@imweb.me](mailto:tech@imweb.me)
