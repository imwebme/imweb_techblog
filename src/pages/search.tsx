import type { GetStaticProps, InferGetStaticPropsType } from "next"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import Layout from "@/components/layout/Layout"
import PostCard from "@/components/home/PostCard"
import { getPosts } from "@/lib/notion/getPosts"
import { safeAsync } from "@/lib/utils/safeAsync"

type Props = {
  posts: Awaited<ReturnType<typeof getPosts>>
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await safeAsync(() => getPosts(), [], "search")
  return { props: { posts } }
}

export default function SearchPage({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const [q, setQ] = useState("")

  // URL 의 ?q= 를 초기값으로 반영
  useEffect(() => {
    if (!router.isReady) return
    const init = typeof router.query.q === "string" ? router.query.q : ""
    setQ(init)
  }, [router.isReady, router.query.q])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    return posts.filter((p) => {
      const haystack = [p.title, p.summary, ...p.category, ...p.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [q, posts])

  return (
    <Layout>
      <section className="container mx-auto pt-12 pb-24">
        <h1 className="text-h1 sm:text-[2.25rem] font-bold tracking-[-0.025em] text-ink-900">
          검색
        </h1>
        <p className="mt-2 text-ink-500">
          제목·요약·카테고리·태그에서 검색합니다.
        </p>

        <div className="mt-6 relative">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어를 입력하세요"
            autoFocus
            className="w-full rounded-xl border border-line bg-card px-5 py-4 pr-12 text-base text-ink-900 placeholder:text-ink-500 outline-none transition-colors focus:border-brand"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-500"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>

        <div className="mt-8">
          {q.trim() === "" ? (
            <div className="py-16 text-center text-ink-500">
              검색어를 입력하면 결과가 표시됩니다.
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-lg font-semibold text-ink-900">
                일치하는 글이 없어요
              </div>
              <div className="mt-2 text-sm text-ink-500">
                다른 키워드로 다시 검색해보세요.
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 text-sm text-ink-500">
                <span className="font-semibold text-ink-900">
                  {filtered.length}
                </span>
                개 결과
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filtered.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}
