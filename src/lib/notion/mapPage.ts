import type { ExtendedRecordMap } from "notion-types"
import type { TPost, TPostStatus, TAuthor } from "@/types"
import { slugify } from "@/lib/utils/slugify"

// NotionX recordMap 의 한 페이지(row block) 를 화면에서 다루기 좋은 TPost 로 변환합니다.
// 비공식 API 응답이라 속성이 schema 의 hash ID 로 keyed 되어 있어, 이름→id 매핑부터 시작합니다.

// notion-client 는 record 를 { spaceId, value: { value: actualBlock, role } } 로 이중 래핑하기도 하므로
// 안전하게 풀어내는 헬퍼.
export const unwrap = (record: any): any => {
  if (!record) return null
  if (record.value) return unwrap(record.value)
  return record
}

// 스키마에서 후보 이름들 중 하나와 매치되는 prop id 를 찾습니다.
// 1차: 정확 일치 (대소문자 무시) — 의도된 정확한 매핑
// 2차: prefix 매치 — 노션에서 사용자가 메모를 붙인 경우 ("tags(최대 3개)")도 잡아냄
export const findPropId = (
  schema: Record<string, { name: string; type: string }>,
  names: string[]
): string | null => {
  const lower = names.map((n) => n.toLowerCase())
  for (const [id, s] of Object.entries(schema)) {
    if (lower.includes(s.name?.toLowerCase())) return id
  }
  for (const [id, s] of Object.entries(schema)) {
    const n = s.name?.toLowerCase() || ""
    if (lower.some((cand) => n.startsWith(cand))) return id
  }
  return null
}

const richToText = (raw: any[][] | undefined): string => {
  if (!raw) return ""
  return raw.map((seg) => seg?.[0] ?? "").join("")
}

const pickText = (
  block: any,
  schema: any,
  names: string[]
): string => {
  const id = findPropId(schema, names)
  if (!id) return ""
  return richToText(block.properties?.[id])
}

const pickSelect = (
  block: any,
  schema: any,
  names: string[]
): string | null => {
  const text = pickText(block, schema, names)
  return text || null
}

// multi-select 값 파싱.
//
// 노션에서 옵션을 삭제해도 이미 그 값을 쓰던 페이지의 속성에는 raw 문자열이
// 그대로 남습니다. 노션 UI 는 옵션에 없는 값을 숨기지만 비공식 API 는 raw 를
// 그대로 주기 때문에, 걸러내지 않으면 운영자가 지운 태그·카테고리가 사이트에
// 유령처럼 계속 노출됩니다. 스키마의 옵션 목록을 단일 진실 원천으로 삼아
// 정의되지 않은 값은 버립니다.
//
// 단, 옵션 목록을 못 읽은 경우(스키마 형태가 바뀌는 등)에는 필터를 적용하지
// 않습니다 — 전체 태그가 한꺼번에 사라지는 쪽이 유령 하나보다 훨씬 위험합니다.
const pickMultiSelect = (
  block: any,
  schema: any,
  names: string[]
): string[] => {
  const text = pickText(block, schema, names)
  if (!text) return []
  const values = text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

  const propId = findPropId(schema, names)
  const options: { value?: string }[] = propId
    ? schema[propId]?.options || []
    : []
  if (options.length === 0) return values

  const defined = new Set(options.map((o) => o.value).filter(Boolean))
  return values.filter((v) => defined.has(v))
}

const pickDate = (block: any, schema: any, names: string[]): string => {
  const id = findPropId(schema, names)
  if (!id) return ""
  const raw = block.properties?.[id]
  if (!raw) return ""
  // 구조: [["‣", [["d", { type, start_date, ... }]]]]
  const formatted = raw?.[0]?.[1]?.[0]?.[1]
  if (formatted?.start_date) return formatted.start_date as string
  return ""
}

const pickCheckbox = (block: any, schema: any, names: string[]): boolean => {
  const text = pickText(block, schema, names)
  return text === "Yes"
}

const pickThumbnail = (
  block: any,
  schema: any,
  recordMap: ExtendedRecordMap
): string | null => {
  // 1) page_cover (block.format.page_cover) 우선
  const pageCover = block.format?.page_cover
  if (pageCover) return resolveImageUrl(pageCover, block.id, recordMap)

  // 2) thumbnail 속성
  const id = findPropId(schema, ["thumbnail", "cover", "썸네일"])
  if (!id) return null
  const raw = block.properties?.[id]
  if (!raw) return null
  // file 속성 구조: [["filename.png", [["a", "https://..."]]]]
  const url = raw?.[0]?.[1]?.[0]?.[1]
  if (!url) return null
  // 노션 신형 attachment 참조 (`attachment:<uuid>:<filename>`) 는 비공식
  // API 로 실제 URL 을 풀어낼 수 없으므로 fallback 처리 (그라데이션 placeholder).
  if (url.startsWith("attachment:")) return null
  return resolveImageUrl(url, block.id, recordMap)
}

// signed S3 URL 은 만료되므로 notion.so 이미지 프록시 경로로 변환합니다.
const resolveImageUrl = (
  url: string,
  blockId: string,
  recordMap: ExtendedRecordMap
): string => {
  if (!url) return url
  if (url.startsWith("/")) {
    return `https://www.notion.so${url}`
  }
  // 외부 URL 은 그대로 사용
  if (
    !url.includes("secure.notion-static.com") &&
    !url.includes("prod-files-secure")
  ) {
    return url
  }
  // 내부 업로드는 프록시
  const u = `https://www.notion.so/image/${encodeURIComponent(url)}?table=block&id=${blockId}&cache=v2`
  return u
}

const pickAuthors = (
  block: any,
  schema: any,
  recordMap: ExtendedRecordMap
): TAuthor[] => {
  const id = findPropId(schema, ["author", "authors", "작성자"])
  if (!id) return []
  const raw = block.properties?.[id]
  if (!raw) return []
  // person 구조: [["‣", [["u", "<userId>"], ["u", "<userId>"]]]]
  const annotations = raw?.[0]?.[1] || []
  const userIds = annotations
    .filter((a: any) => a?.[0] === "u")
    .map((a: any) => a?.[1])
  return userIds
    .map((uid: string) => {
      const u = unwrap(recordMap.notion_user?.[uid])
      if (!u) return null
      // 노션 표시 규칙에 따라 name 우선, 없으면 한국식(성+이름) 으로 조합.
      const fullName = `${u.family_name ?? ""}${u.given_name ?? ""}`.trim()
      const name = u.name || fullName || "Imweb"
      return { name, avatar: u.profile_photo ?? null } as TAuthor
    })
    .filter(Boolean) as TAuthor[]
}

export const mapBlockToPost = (
  block: any,
  schema: any,
  recordMap: ExtendedRecordMap
): TPost => {
  const title = richToText(block.properties?.title)
  const status = (pickSelect(block, schema, ["status", "상태"]) ||
    "Public") as TPostStatus

  const slugRaw = pickText(block, schema, ["slug", "url"])
  const slugified = slugify(slugRaw || title)
  const slug = slugified || block.id

  return {
    id: block.id,
    slug,
    title,
    summary: pickText(block, schema, ["summary", "description", "요약"]),
    cover: pickThumbnail(block, schema, recordMap),
    category: pickMultiSelect(block, schema, ["category", "카테고리"]),
    tags: pickMultiSelect(block, schema, ["tags", "태그"]),
    authors: pickAuthors(block, schema, recordMap),
    date:
      pickDate(block, schema, ["date", "published", "발행일"]) ||
      (block.created_time
        ? new Date(block.created_time).toISOString().slice(0, 10)
        : ""),
    createdTime: block.created_time ?? 0,
    status,
    featured: pickCheckbox(block, schema, ["featured", "추천", "pinned"]),
  }
}
