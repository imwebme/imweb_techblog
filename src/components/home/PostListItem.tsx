import Link from "next/link"
import type { TPost } from "@/types"
import { formatDateShort } from "@/lib/utils/formatDate"
import CoverImage from "@/components/common/CoverImage"

// 리스트 뷰용 가로 카드. 좌측 작은 썸네일 + 우측 제목/요약/메타.
export default function PostListItem({ post }: { post: TPost }) {
  const href = `/posts/${encodeURIComponent(post.slug)}`

  return (
    <Link
      href={href}
      className="lift-card group flex items-stretch overflow-hidden rounded-card bg-white shadow-card hover:shadow-card-hover"
    >
      <div className="relative w-28 sm:w-40 shrink-0 self-stretch bg-surface">
        <CoverImage
          src={post.cover}
          alt={post.title}
          title={post.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
          placeholderClassName="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#EAF2FF] to-[#DDE8FF]"
          initialsClassName="text-xl font-bold text-brand/60 tracking-tight"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 py-3 pr-4 pl-4 sm:py-4 sm:pr-5 sm:pl-5">
        <div>
          {post.category && (
            <div className="mb-1 text-[11px] font-semibold tracking-wider uppercase text-brand">
              {post.category}
            </div>
          )}
          <h3 className="text-base sm:text-[1.05rem] font-bold tracking-[-0.02em] text-ink-900 leading-snug line-clamp-2">
            {post.title}
          </h3>
          {post.summary && (
            <p className="mt-1.5 hidden sm:block text-sm text-ink-700 line-clamp-2">
              {post.summary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-ink-500">
          <span className="text-ink-700 truncate">
            {post.authors.map((a) => a.name).join(", ") || "Imweb Tech"}
          </span>
          <time dateTime={post.date}>{formatDateShort(post.date)}</time>
        </div>
      </div>
    </Link>
  )
}
