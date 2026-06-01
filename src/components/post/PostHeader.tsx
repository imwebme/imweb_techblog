import type { TPost } from "@/types"
import { formatDate } from "@/lib/utils/formatDate"
import CoverImage from "@/components/common/CoverImage"

// 글 상세 페이지 상단 헤더. 큰 제목 + 메타정보 + 카테고리 칩 구성.
export default function PostHeader({ post }: { post: TPost }) {
  return (
    <header className="container mx-auto max-w-prose pt-16 pb-10">
      {post.category && (
        <div className="mb-4 text-sm font-semibold tracking-wider uppercase text-brand">
          {post.category}
        </div>
      )}
      <h1 className="text-[2rem] sm:text-[2.5rem] leading-[1.2] font-bold tracking-[-0.03em] text-ink-900">
        {post.title}
      </h1>
      {post.summary && (
        <p className="mt-5 text-lg sm:text-xl text-ink-700 leading-relaxed">
          {post.summary}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-700">
        <div className="flex items-center gap-2">
          {post.authors[0]?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.authors[0].avatar}
              alt={post.authors[0].name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink-700">
              {(post.authors[0]?.name || "I").slice(0, 1)}
            </span>
          )}
          <span className="font-medium text-ink-900">
            {post.authors.map((a) => a.name).join(", ") || "Imweb Tech"}
          </span>
        </div>
        <span className="text-ink-500">·</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>

      {post.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="chip">
              # {t}
            </span>
          ))}
        </div>
      )}

      {post.cover && (
        <div className="mt-10 -mx-5 sm:mx-0 sm:rounded-card overflow-hidden">
          <CoverImage
            src={post.cover}
            alt={post.title}
            title={post.title}
            className="w-full aspect-[16/9] object-cover"
            placeholderClassName="aspect-[16/9]"
            initialsClassName="text-4xl font-bold text-brand/60 tracking-tight"
          />
        </div>
      )}
    </header>
  )
}
