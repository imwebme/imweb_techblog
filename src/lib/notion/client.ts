import { NotionAPI } from "notion-client"
import type { ExtendedRecordMap } from "notion-types"

// notion-client 는 요청에 User-Agent 를 붙이지 않습니다. www.notion.so 앞단의
// Cloudflare 가 UA 없는 POST 를 봇으로 보고 403(Attention Required) 을 돌려주기
// 때문에, 모든 요청에 브라우저 UA 를 명시합니다. (2026-08-05 전 글 미노출 장애)
// 생성자의 ofetchOptions.headers 는 getPage / getUsers 등 모든 호출에 적용됩니다.
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

// 비공식(public) Notion API 클라이언트.
// 토큰이 필요 없으며, 노션 페이지가 "웹에 게시(Share to web)" 되어 있어야 합니다.
const notion = new NotionAPI({
  ofetchOptions: {
    headers: {
      "user-agent": BROWSER_USER_AGENT,
      accept: "*/*",
    },
  },
})

// 컬렉션(=글 DB) 한 번에 가져오는 최대 행 수.
// notion-client 의 reducer 기본값은 999 이지만, 비공식 API 에는 cursor 기반
// 페이지네이션이 노출돼 있지 않으므로 글이 늘어나도 누락되지 않도록 명시적으로
// 넉넉히 올려둡니다. (react-notion-x / morethan-log 도 동일하게 limit 을 키우는 방식)
export const COLLECTION_FETCH_LIMIT = 10000

// 빌드 안정성:
//   - 5xx / 네트워크 오류 시 자동 재시도 (1s, 2s, 4s)
//   - 컬렉션 쿼리 에러는 silently swallow 하지 않고 throw → 재시도 트리거
//   - collectionReducerLimit 로 글 목록 누락 방지 (위 상수 참고)
const DEFAULT_FETCH_OPTIONS = {
  throwOnCollectionErrors: true,
  collectionReducerLimit: COLLECTION_FETCH_LIMIT,
  ofetchOptions: { retry: 3, retryDelay: 1000 },
} as const

export const fetchPage = (pageId: string): Promise<ExtendedRecordMap> =>
  notion.getPage(pageId, DEFAULT_FETCH_OPTIONS as any)

// 공개 게시 페이지의 recordMap 에는 notion_user 가 비어있어 별도 fetch 가 필요합니다.
// 응답 형태: { recordMapWithRoles: { notion_user: { [id]: { value: { value: User } } } } }
export const fetchUsers = async (
  userIds: string[]
): Promise<Record<string, unknown> | null> => {
  if (userIds.length === 0) return null
  try {
    const resp: any = await (notion as any).getUsers(userIds)
    return resp?.recordMapWithRoles?.notion_user ?? null
  } catch {
    return null
  }
}
