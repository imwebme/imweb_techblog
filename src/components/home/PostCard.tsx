import Link from "next/link"
import type { TPost } from "@/types"
import { formatDateShort } from "@/lib/utils/formatDate"
import CoverImage from "@/components/common/CoverImage"

type Variant = "default" | "featured"

// 글 한 건을 카드 형태로 표시합니다.
// featured 모드는 큰 썸네일 + 두꺼운 제목으로, 일반 모드는 컴팩트한 카드로 렌더링합니다.
export default function PostCard({
  post,
  variant = "default",
}: {
  post: TPost
  variant?: Variant
}) {
  const href = `/posts/${encodeURIComponent(post.slug)}`
  const isFeatured = variant === "featured"

  return (
    <Link
      href={href}
      className="lift-card group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card hover:shadow-card-hover"
    >
      <div
        className={`relative w-full overflow-hidden bg-surface ${
          isFeatured ? "aspect-[16/9]" : "aspect-[16/10]"
        }`}
      >
        <CoverImage
          src={post.cover}
          alt={post.title}
          title={post.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
          placeholderClassName="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EAF2FF] to-[#DDE8FF]"
          initialsClassName="text-3xl sm:text-4xl font-bold text-brand/60 tracking-tight"
        />
      </div>

      <div className={`flex flex-1 flex-col ${isFeatured ? "p-7" : "p-5"}`}>
        {post.category && (
          <div className="mb-2 text-xs font-semibold tracking-wider uppercase text-brand">
            {post.category}
          </div>
        )}
        <h3
          className={`font-bold tracking-[-0.02em] text-ink-900 line-clamp-2 ${
            isFeatured ? "text-2xl leading-tight" : "text-[1.125rem] leading-snug"
          }`}
        >
          {post.title}
        </h3>
        {post.summary && (
          <p
            className={`mt-2 text-ink-700 line-clamp-2 ${
              isFeatured ? "text-base" : "text-sm"
            }`}
          >
            {post.summary}
          </p>
        )}

        <div className="mt-auto pt-5 flex items-center justify-between text-xs text-ink-500">
          <div className="flex items-center gap-2">
            {post.authors[0]?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.authors[0].avatar}
                alt={post.authors[0].name}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface text-[10px] font-semibold text-ink-700">
                {(post.authors[0]?.name || "I").slice(0, 1)}
              </span>
            )}
            <span className="text-ink-700">
              {post.authors.map((a) => a.name).join(", ") || "Imweb Tech"}
            </span>
          </div>
          <time dateTime={post.date}>{formatDateShort(post.date)}</time>
        </div>
      </div>
    </Link>
  )
}
