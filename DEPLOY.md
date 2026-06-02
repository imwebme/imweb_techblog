# 배포 가이드

이 프로젝트는 `imwebme/imweb_techblog` 저장소를 기반으로 운영됩니다.

빌드 시 노션 데이터는 **비공식 Notion API(`notion-client`)** 로 가져옵니다. **Integration 토큰이 필요하지 않습니다.** 대신 노션 DB 페이지가 "웹에 게시(Share to web)" 되어 있어야 합니다.

## 1. 노션 DB 공개 게시 (한 번만)

1. 대상 DB 페이지([링크](https://www.notion.so/imweb/09870e1112ce83098f628118b6ba9bb3))에서 우측 상단 `Share` → `Publish` 탭
2. `Publish to web` 활성화
3. (선택) `Search engine indexing` 끄기 — 구글 검색 노출은 막고, 우리 빌드만 접근하도록

URL은 그대로(`notion.so/imweb/...`) 유지되지만, 비로그인 상태에서도 비공식 API로 접근이 가능해집니다.

## 2. GitHub Pages 활성화

저장소의 **Settings → Pages**:
- Source: `GitHub Actions`
- Custom domain: `tech.imweb.me` ([`public/CNAME`](./public/CNAME) 으로 자동 등록)

별도의 시크릿 등록은 필요 없습니다. DNS 는 사내 인프라가 `tech.imweb.me` → `imwebme.github.io` CNAME 으로 잡아둡니다.

## 3. 푸시 → 자동 배포

```bash
git add .
git commit -m "..."
git push origin main
```

`.github/workflows/deploy.yml` 이 `push: branches: [main]` 트리거 + 30분 cron(노션 변경 반영용)으로 동작하여 GitHub Pages 로 자동 배포합니다.

배포 후 사이트는 [https://tech.imweb.me](https://tech.imweb.me) 에서 확인할 수 있습니다. (커스텀 도메인이 풀리면 자동으로 [imwebme.github.io/imweb_techblog](https://imwebme.github.io/imweb_techblog) 폴백.)

## 로컬 개발

```bash
npm install
npm run dev      # http://localhost:3000
```

토큰 없이 바로 동작합니다 (위 1번이 완료되어 있다는 전제).

## 로컬 정적 빌드 검증

```bash
npm run build
npx serve out -l 4000
```

`http://localhost:4000` 에서 `./out` 결과물이 그대로 GitHub Pages 와 동일하게 동작하는지 확인합니다.

## 노션에 새 글을 쓰면

- 빌드는 30분마다 cron 으로 트리거되어 새 글이 사이트에 자동 반영됩니다.
- 즉시 반영이 필요하면 GitHub `Actions` 탭 → `Deploy to GitHub Pages` → `Run workflow` 로 수동 트리거.
- 로컬 dev 서버는 `getStaticPaths` 결과를 캐시하므로, 노션에서 글을 새로 추가한 후에는 dev 서버를 재시작해야 새 글의 상세 페이지가 잡힙니다.

## 카드 썸네일

노션의 신형 첨부 업로드(`attachment:<uuid>:<file>`)는 비공식 API 로 풀어낼 수 없습니다. 카드 썸네일을 노출하려면:

- 이미지를 [`public/post-images/`](./public/post-images/) 에 커밋 → 노션 `thumbnail` 컬럼에 사이트 URL (`https://tech.imweb.me/post-images/<파일명>`) 임베드
- 또는 Unsplash 등 외부 호스팅 URL 임베드

## 트러블슈팅

- **빌드 단계에서 `missing user <uuid>` 경고** — 페이지의 모든 사용자 참조를 `notion.getUsers()` 로 보강하지만, 일부 케이스(권한이 부족한 사용자 ID 등)는 풀리지 않을 수 있습니다. 렌더링에 영향은 없습니다.
- **"잠시만 기다려주세요" 화면이 표시됨** — 노션 API 호출이 retry 후에도 실패한 경우의 graceful fallback. Actions 로그의 `console.error` 흔적을 확인하고, 보통은 다음 cron(30분 이내) 또는 수동 트리거로 자연 복구됩니다.
- **빌드가 실패하며 "page not found" 같은 메시지** — 1번 단계의 "Publish to web" 가 풀려있을 가능성이 큽니다. 다시 켜주세요.
- **글이 50건이 넘어가면** 첫 페이지만 가져올 수 있습니다. 그때는 `src/lib/notion/getPosts.ts` 에서 `notion.getCollectionData(...)` 페이지네이션을 보강해야 합니다.

## 사이트를 외부에 공개하지 않으려면

```bash
gh api -X DELETE /repos/imwebme/imweb_techblog/pages
```

다시 켤 때:

```bash
gh api -X POST /repos/imwebme/imweb_techblog/pages -f "build_type=workflow"
gh workflow run "Deploy to GitHub Pages" --ref main
```

## 도메인 / basePath 메모

- 현 운영: 커스텀 도메인 `tech.imweb.me` ([`public/CNAME`](./public/CNAME)). `actions/configure-pages` 가 이를 감지해 `BASE_PATH=""` 을 주입하고, `next.config.js` 는 그 값을 그대로 사용합니다 (`??` 로 빈 문자열 보존).
- CNAME 을 떼면 `configure-pages` 출력이 `/imweb_techblog` 가 되어 프로젝트 페이지(`imwebme.github.io/imweb_techblog`)로 자동 폴백합니다.
- `<owner>.github.io` 사용자 페이지로 옮길 때는 CNAME 을 지우고 저장소 이름을 `<owner>.github.io` 로 바꾸면 자동으로 빈 basePath 가 적용됩니다.

> ⚠️ 과거 `next.config.js` 의 폴백이 `||` 로 작성돼 있어 `BASE_PATH=""` 이 falsy 로 떨어져 `/imweb_techblog` 가 잘못 박히는 함정이 있었습니다 (`??` 로 정정 완료).
