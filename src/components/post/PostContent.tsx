import dynamic from "next/dynamic"
import type { ExtendedRecordMap } from "notion-types"
import { NotionRenderer } from "react-notion-x"

// react-notion-x 의 고급 블록(code highlight, collection, equation, pdf) 는
// 별도 번들이므로 dynamic import 로 SSR 시 무거워지지 않게 분리합니다.
const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
)
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then((m) => m.Collection)
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  { ssr: false }
)

// Notion 페이지의 recordMap 을 그대로 렌더링합니다.
export default function PostContent({
  recordMap,
}: {
  recordMap: ExtendedRecordMap
}) {
  return (
    <article className="container mx-auto max-w-prose pb-20">
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          // 노션 컬렉션 페이지의 속성 패널(.notion-collection-page-properties)을
          // 비웁니다. 이 패널은 글 메타데이터(작성자/날짜/태그 등)를 중복으로 보여줄 뿐
          // 아니라(이미 PostHeader 에 표시), person 속성이 <span> 안에 <img> 를 렌더해
          // React hydration 경고(<img> in <span>)를 유발합니다. CSS 로 숨겨도 DOM 에는
          // 남아 경고가 계속되므로, 속성 값 렌더 자체를 막아 근본 제거합니다.
          // (글 본문에 inline DB 를 embed 하는 경우는 사실상 없으므로 안전)
          Property: () => null,
          nextImage: undefined,
          nextLink: undefined,
        }}
      />
    </article>
  )
}
