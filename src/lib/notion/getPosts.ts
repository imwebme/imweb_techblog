import type { ExtendedRecordMap } from "notion-types"
import { fetchPage } from "./client"
import { enrichAuthorUsers } from "./enrichUsers"
import { findPropId, mapBlockToPost, unwrap } from "./mapPage"
import type { TPost } from "@/types"

const CONFIG = require("../../../site.config")

// 비공식 API 는 collection_query 한 번에 전체 row 를 돌려주지 않을 수 있으므로,
// 우선 단순 케이스로 처리하고 필요 시 getCollectionData 로 페이지네이션을 보강합니다.
type CollectionQueryResult = {
  blockIds?: string[]
  collection_group_results?: { blockIds?: string[] }
}

const extractBlockIds = (query: CollectionQueryResult | undefined): string[] => {
  if (!query) return []
  if (query.blockIds) return query.blockIds
  if (query.collection_group_results?.blockIds)
    return query.collection_group_results.blockIds
  return []
}

const fetchDatabaseRecordMap = async (): Promise<ExtendedRecordMap> => {
  return fetchPage(CONFIG.notion.databaseId)
}

export async function getPosts(): Promise<TPost[]> {
  const recordMap = await fetchDatabaseRecordMap()

  const collectionEntry = Object.entries(recordMap.collection || {})[0]
  if (!collectionEntry) return []
  const [collId, collRecord] = collectionEntry
  const collection = unwrap(collRecord)
  const schema = collection?.schema
  if (!schema) return []

  const perView = recordMap.collection_query?.[collId]
  if (!perView) return []
  // 첫 번째 view 를 기준으로 표시 순서를 사용합니다.
  const firstQuery = Object.values(perView)[0] as CollectionQueryResult | undefined
  const ids = extractBlockIds(firstQuery)

  // 작성자 보강 (notion_user 매핑 추가)
  const authorPropId = findPropId(schema, ["author", "authors", "작성자"])
  if (authorPropId) {
    await enrichAuthorUsers(recordMap, ids, authorPropId)
  }

  const posts: TPost[] = []
  for (const id of ids) {
    const block = unwrap(recordMap.block[id])
    if (!block || block.type !== "page") continue
    posts.push(mapBlockToPost(block, schema, recordMap))
  }

  return posts
    .filter((p) => p.status === "Public" || (p.status as string) === "공개")
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostSlugs(): Promise<string[]> {
  const posts = await getPosts()
  return posts.map((p) => p.slug)
}

export async function getCategories(): Promise<
  { name: string; count: number }[]
> {
  const posts = await getPosts()
  const map = new Map<string, number>()
  for (const p of posts) {
    if (!p.category) continue
    map.set(p.category, (map.get(p.category) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getPosts()
  const map = new Map<string, number>()
  for (const p of posts) {
    for (const t of p.tags) map.set(t, (map.get(t) || 0) + 1)
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}
