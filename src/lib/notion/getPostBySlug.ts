import type { ExtendedRecordMap } from "notion-types"
import { fetchPage } from "./client"
import { enrichAllUsers } from "./enrichUsers"
import { getPosts } from "./getPosts"
import type { TPost } from "@/types"

// 슬러그로 단일 글을 찾고, 본문 렌더링에 필요한 recordMap 까지 함께 반환합니다.
// recordMap 은 react-notion-x 의 <NotionRenderer recordMap={...} /> 에 그대로 전달됩니다.
export async function getPostBySlug(
  slug: string
): Promise<(TPost & { recordMap: ExtendedRecordMap }) | null> {
  const posts = await getPosts()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return null

  const recordMap = await fetchPage(post.id)
  await enrichAllUsers(recordMap)
  stripCrdtData(recordMap)
  return { ...post, recordMap }
}

// 블록마다 붙어 오는 crdt_data(노션의 동시 편집 이력)를 지운다.
//
// recordMap 은 페이지 props 로 HTML 과 /_next/data JSON 에 통째로 실리는데,
// 이 필드가 글에 따라 노션 데이터의 80% 이상을 차지한다(큰 글 710KB 중 595KB).
// react-notion-x·notion-utils·우리 코드 어디서도 읽지 않아 렌더링엔 영향이 없다.
const stripCrdtData = (recordMap: ExtendedRecordMap): void => {
  for (const record of Object.values(recordMap.block || {})) {
    // notion-client 는 { value: { value: block } } 로 이중 래핑하기도 하므로 끝까지 내려간다.
    let node: any = record
    while (node && typeof node === "object") {
      delete node.crdt_data
      node = node.value
    }
  }
}
