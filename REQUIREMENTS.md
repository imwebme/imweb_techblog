# 아임웹 테크 — 요구사항 정의서

> 향후 의사결정의 근거 자료 또는 새 팀원 온보딩용으로 사용합니다.

- **프로덕트명**: 아임웹 테크
- **URL**: https://tech.imweb.me > 도메인 구매 필요
- **목적**: 아임웹 기술 조직의 이야기를 외부에 공유하는 공식 기술 블로그
- **운영 주체**: 아임웹 (주식회사)
- **콘텐츠 책임자**: 기술 조직
- **마지막 업데이트**: 2026-05-15

---

## 1. 제품 개요

### 1.1 미션
- 아임웹 엔지니어들이 풀어낸 문제와 의사결정 과정을 외부에 공개
- 기술 채용 브랜딩 보조

### 1.2 핵심 가치 제안
| 대상 | 가치 |
|---|---|
| 개발자 독자 | 실제 운영 환경의 문제 해결 사례, 의사결정 트레이드오프 |
| 잠재 지원자 | 조직의 기술 수준·문화·관심사 |
| 사내 엔지니어 | 글쓰기 부담 최소화 (CMS는 노션 활용) |

### 1.3 페르소나
- **독자 A — 시니어 개발자**: 깊이 있는 사례·회고를 찾음. 빠른 스캔 + 필요한 글 깊이 읽기
- **독자 B — 채용 후보자**: 조직 분위기·기술 스택 파악. About 페이지 → 채용 페이지로 이동
- **작성자 — 아임웹 엔지니어**: 노션에 글을 쓰고, 발행은 상태 토글만으로

---

## 2. 정보 구조 (Information Architecture)

```
/                  메인 (최근 글 + 전체 글 + 사이드바)
/posts/<slug>/     글 상세
/tags/             태그 목록
/search/?q=...     검색 결과
/about/            소개
(외부) 채용         https://career.imweb.me
(외부) 개발자센터   https://developers.imweb.me
```

### 2.1 글로벌 네비게이션
| 메뉴 | 동작 |
|---|---|
| 로고 (심볼 + "아임웹 테크") | 메인으로 이동 |
| 글 | 메인 (전체 글) |
| 채용 | 외부 (새 탭) |
| 개발자센터 | 외부 (새 탭) |
| 검색창 (돋보기 + 입력 박스) | 입력 후 Enter → `/search?q=...` |

### 2.2 푸터
- **브랜드**: 사이트명 + 한 줄 소개
- **메뉴 컬럼**: 아임웹 / 채용 / Contact (mailto)
- **회사 정보 컬럼**: 상호명, 대표이사, 개인정보책임자
- **등록 정보 컬럼**: 사업자등록번호, 통신판매업, 본사 주소
- **저작권 표기**: © {year} Imweb

---

## 3. 페이지별 기능 요구사항

### 3.1 메인 (`/`)

| 영역 | 요구사항 |
|---|---|
| **고정형 배너** | 사이트 슬로건 배너 이미지 노출. 카드형, 컨테이너 풀폭. 클릭 동작 없음 (확장 가능) |
| **최근 글 (Featured)** | DB 의 `featured = true` 인 글 우선. 부족 시 최신순으로 채워 **2개** 노출. 카드 형식 (썸네일 + 제목 + 요약 + 작성자/날짜). 좌우 균등 grid |
| **사이드바 — 카테고리** | 모든 글의 카테고리를 수량 내림차순 정렬. "전체" + 각 카테고리 토글. 선택 시 본문 영역 필터 |
| **사이드바 — 태그** | 칩 형태. 멀티 토글은 아니고 단일 선택 (재선택 시 해제) |
| **전체 글** | 본문 영역의 메인 리스트. 기본 정렬: 발행일 내림차순 |
| **뷰 토글** | 그리드 / 리스트 토글 버튼. **기본: 리스트**. 컴포넌트 내 state (페이지 이동 시 초기화) |
| **빈 상태** | 카테고리/태그 필터 후 결과가 없으면 "조건에 맞는 글이 아직 없어요" 표시 |

### 3.2 글 상세 (`/posts/<slug>/`)

| 영역 | 요구사항 |
|---|---|
| **글 헤더** | 카테고리 라벨, 제목, 요약, 작성자/날짜, 태그 칩, 커버 이미지 |
| **본문** | 노션 페이지 블록을 시각적으로 동일하게 렌더링 (제목, 코드 블록, 콜아웃, 이미지, 수식, 인용, 표, 토글 등) |
| **공유 버튼** | 본문 하단 중앙. Web Share API 지원 시 OS 공유 시트. 미지원 시 URL 클립보드 복사 + "링크 복사됨" 안내 |
| **댓글** | GitHub 계정 로그인 후 댓글 작성. GitHub Discussions 가 백엔드. 페이지당 하나의 Discussion (페이지 경로로 매핑). 반응(이모지) 지원 |
| **하단 네비** | "← 모든 글 보기" 링크 |
| **메타데이터** | `<title>`, `<meta description>`, OG title/description/image (커버 이미지) |

### 3.3 태그 페이지 (`/tags/`)

- 모든 태그를 칩 형태로 나열 (수량 내림차순)
- 각 칩 클릭 시 `/?tag=<name>` 로 이동 (메인의 태그 필터 활성화)
- 헤더에 글 수 + 태그 수 표시

### 3.4 검색 페이지 (`/search/`)

| 항목 | 요구사항 |
|---|---|
| **입력** | 큰 검색 input (autofocus). URL 의 `?q=` 값이 초기값으로 반영 |
| **검색 범위** | 제목 / 요약 / 카테고리 / 태그 (substring, 대소문자 무시) |
| **검색 시점** | 입력하는 즉시 결과 반영 (debounce 없음) |
| **결과 표시** | 카드 그리드 (모바일 1, 태블릿 2, 데스크탑 3열). 결과 수 표시 |
| **빈 쿼리** | "검색어를 입력하면 결과가 표시됩니다." 안내 |
| **무결과** | "일치하는 글이 없어요" 안내 |

### 3.5 소개 페이지 (`/about/`)

- 사이트 한 줄 설명
- 두 개의 카드: "아임웹 (메인 사이트)", "채용"

---

## 4. 콘텐츠 모델 (노션 DB)

### 4.1 DB 속성 정의
| 속성 | 타입 | 필수 | 비고 |
|---|---|---|---|
| `title` | Title | ✅ | 글 제목 |
| `slug` | Text | 권장 | URL 의 일부 (`/posts/<여기>/`). 영문 소문자 + 숫자 + 하이픈. 비워두면 title 을 자동 변환. **한 번 정한 후 가급적 변경 금지** (공유된 URL 깨짐) |
| `status` | Select | ✅ | `Public` / `PublicOnDetail` / 기타 |
| `category` | Select | 권장 | 사이드바·카드의 카테고리 |
| `tags` | Multi-select | 선택 | 멀티 |
| `summary` | Text | 권장 | 카드/메타 description |
| `date` | Date | 권장 | 발행일 (정렬 키). 미설정 시 페이지 생성일 사용 |
| `thumbnail` | File | 선택 | 카드 썸네일. 노션 직접 업로드 대신 **외부 이미지 URL 임베드 필요** (제약 항목 참고) |
| `author` | Person | 선택 | 카드/상세 페이지에 노출 |
| `featured` | Checkbox | 선택 | Featured 영역 노출 우선 |

### 4.2 상태(`status`) 정책

| 상태 | 메인 노출 | 상세 페이지 접근 | 용도 |
|---|---|---|---|
| **Public** | ✅ | ✅ | 정상 공개 |
| **PublicOnDetail** | ❌ | ❌ | 작성 후 수정 중 — 완전 숨김 |
| 그 외 / 미설정 | ❌ | ❌ | 빌드 시 제외 |

> 향후 "URL 공유 전용 (목록 숨김, 직접 접근만 가능)" 정책이 필요하면 `PublicOnDetail` 의 상세 접근을 허용하는 분기가 추가될 수 있음 (현재는 둘 다 차단).

### 4.3 콘텐츠 등록 워크플로우

1. 작성자는 노션의 기술 블로그 DB 에서 새 페이지 생성
2. 본문 작성. `title` / `slug` / `category` / `tags` / `summary` / `date` / `thumbnail` 입력
3. `status = Public` 으로 변경
4. **30분 이내 자동 반영** (또는 GitHub Actions 수동 트리거 시 즉시)

---

## 5. 미디어 / 이미지 정책

### 5.1 카드 썸네일 / 글 커버
- **권장**: 이미지 파일을 [`public/post-images/`](public/post-images/) 에 커밋하고 GitHub Pages URL 을 노션 `thumbnail` 컬럼에 임베드
- 이유: 노션 신형 attachment 시스템은 비공식 API 로 풀 수 없어 미노출됨 (제약 항목 참고)
- 파일명 규칙: 영문 소문자, 하이픈, 글 prefix (예: `datadog-rum-cover.webp`)

### 5.2 본문 이미지
- 노션 본문에 붙여넣은 이미지는 본문 렌더러가 그대로 표시
- 단, 노션 신형 업로드는 안 보일 가능성 — 외부 

URL 임베드를 권장

---

## 6. 검색 / 발견 가능성 (SEO · 구독 포함)

- 각 글의 `<title>` / OG meta 자동 생성
- `sitemap.xml` 자동 생성 (홈/태그/소개 + 전체 글, 빌드마다 갱신)
- `feed.xml` (RSS 2.0) / `atom.xml` (Atom 1.0) 자동 생성, 최근 20개 글
- 사이트 `<head>` 에 `<link rel="alternate">` 로 구독 앱 자동 감지
- 검색엔진 색인 — 노션 페이지의 "Search engine indexing" 은 비활성 권장 (구글 검색은 정적 사이트만 색인)

---

## 7. 댓글 시스템 요구사항

| 항목 | 정책 |
|---|---|
| **인증** | GitHub OAuth 만 허용 (별도 가입 없음) |
| **백엔드** | GitHub Discussions (giscus) |
| **글당 스레드** | 페이지 경로(`pathname`) 1개 = Discussion 1개 |
| **카테고리** | 레포의 Discussions 카테고리 중 지정 |
| **반응(이모지)** | 활성 |
| **언어** | 한국어 |
| **모더레이션** | GitHub Discussions 의 모더레이션 도구 사용 (스레드 잠금, 삭제) |

---

## 8. 비기능 요구사항

### 8.1 디자인
- **테마**: 라이트 모드 전용 (다크 모드 미지원) > 추후 제공 가능
- **타이포**: Pretendard (한글), Inter 계열 sans-serif fallback
- **컬러**: 흑백 베이스 + 브랜드 블루 (`#3182F6`) 포커스 컬러
- **모서리/여백**: 카드 16px round, 컨테이너 max-width 1200px

### 8.2 반응형
| 브레이크포인트 | 적용 |
|---|---|
| `< 640px` (모바일) | 사이드바 위로 스택, 카드 1열, 검색 input 숨김 |
| `640~1024px` (태블릿) | 카드 2열, 사이드바 위 스택 |
| `>= 1024px` (데스크탑) | 사이드바 좌측 220px + 본문 우측 1fr, 카드 3열 |

### 8.3 성능
- 정적 export → 첫 페인트 빠름 (HTML 즉시)
- 본문의 무거운 컴포넌트 (코드/콜렉션/수식) 는 dynamic import
- 이미지 lazy-load (썸네일), eager-load (배너)

### 8.4 접근성
- 시멘틱 HTML (`<nav>`, `<article>`, `<section>`)
- 버튼 `aria-label`, 토글 `aria-pressed`
- 검색 input `role="search"`

---

## 9. 운영 / 배포

| 항목 | 정책 |
|---|---|
| **호스팅** | GitHub Pages (정적 사이트) |
| **빌드** | GitHub Actions (`.github/workflows/deploy.yml`) |
| **트리거** | `main` push, 매 30분 cron, 수동 (`Run workflow`) |
| **노션 변경 반영** | 최대 30분 (cron 주기) |
| **즉시 반영 방법** | Actions 탭 → `Deploy to GitHub Pages` → `Run workflow` |
| **로컬 개발** | `npm run dev` — 새로고침마다 노션 fetch (단, 새 글의 상세 페이지는 dev 서버 재시작 필요) |

---

## 10. 변경 이력 (Changelog)

> 자세한 내역은 GitHub commit history 참고. 주요 변경만 요약.

| 일자 | 변경 |
|---|---|
| 2026-05-13 | 초기 셋업 (notion-client 기반) |
| 2026-05-13 | 초기 디자인 베이스 정리, 좌측 사이드바 도입, 다크모드 제거 |
| 2026-05-14 | 헤더 로고 (symbol.webp), 채용/개발자센터 메뉴, 검색창 추가 |
| 2026-05-14 | 푸터 회사 정보 섹션 추가, 브랜드명 "아임웹 테크" |
| 2026-05-14 | giscus 댓글 활성화, 공유 버튼 추가 |
| 2026-05-14 | 최근 글 2개 그리드, 전체 글 그리드/리스트 토글 |
| 2026-05-14 | 메인 배너 (banner.webp) 추가 |
| 2026-05-21 | RSS(feed.xml) / Atom(atom.xml) / sitemap.xml 자동 생성 |
| 2026-05-25 | 노션 파싱·스냅샷 단위 테스트 도입, 글 목록 페이지네이션 한계 제거 |
| 2026-05-26 | 본문(`react-notion-x`) 톤앤매너 재정의, 푸터 좁은 화면 2열, 커버 이미지 fallback |
| 2026-05-27 | 다크모드 재도입(기본 라이트), 로고 SVG 교체, 모바일 헤더(햄버거+검색바), 페이지네이션, 리스트 썸네일 16:10 flush |
| 2026-05-28 | 채용 CTA 하단 LED 전광판 |
| 2026-05-29 | 메인 이벤트 팝업, 모바일 리스트 뷰 썸네일 숨김 |
| 2026-06-02 | 카테고리 multi-select 마이그레이션, 팀 레포 이전(`imwebme/imweb_techblog`), 리스트 썸네일 우측 배치(sm+), `findPropId` prefix 매치 폴백 |
| 2026-06-04 | 커스텀 도메인 `tech.imweb.me` + CNAME, `BASE_PATH ??` 수정, GA4 도입(전수 집계), 메인 배너 공식 이미지로 교체 |
| 2026-06-05 | SEO 정비 — JSON-LD(WebSite·Organization), `blog.alternateNames`, robots.txt sitemap URL 정정, Google Search Console 등록 |
| 2026-06-08 | 이벤트 팝업 — 자유 비율 이미지 + 캘린더 자정 리셋, BRANDCON26 적용 |
| 2026-06-10 | 이벤트 팝업 닫기 버튼 가시성 개선, README 정리 (라이선스 표기 제거, Contact 추가) |

---

## 부록 A — 디렉터리 가이드

```
src/
  components/
    home/         메인 영역 (Banner, FeaturedPosts, PostCard, PostListItem, PostGrid, Sidebar)
    layout/       전역 (Header, Footer, Layout)
    post/         글 상세 (PostHeader, PostContent, PostActions, Comments)
  lib/
    notion/       노션 데이터 페치/매핑
    utils/        formatDate, slugify, withBasePath
  pages/          라우트 (index, posts/[slug], tags, search, about)
  styles/         globals.css (디자인 토큰 + prose-body / lift-card / chip)
  types/          공용 타입 (TPost, TAuthor, TPostStatus)
public/
  symbol.webp     로고
  banner.webp     메인 배너
  post-images/    글에 임베드하는 이미지 (수동 큐레이션)
site.config.js    사이트 전역 설정 (이 한 파일로 대부분 변경 가능)
```

## 부록 B — 사이트 설정 ([site.config.js](site.config.js)) 주요 항목

| 키 | 의미 |
|---|---|
| `blog.title` | 사이트명 ("아임웹 테크") |
| `blog.description` | 사이트 한 줄 소개 |
| `nav` | 글로벌 네비게이션 항목 |
| `social.contactEmail` | 푸터 Contact 메일 |
| `company.*` | 푸터 회사 정보 |
| `home.featuredCount` | Featured 영역 노출 수 |
| `notion.databaseId` | 콘텐츠 소스 노션 DB |
| `comments.giscus` | 댓글 설정 (repoId, categoryId) |
