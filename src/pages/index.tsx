import type { GetStaticProps, InferGetStaticPropsType } from "next"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/layout/Layout"
import Banner from "@/components/home/Banner"
import PostGrid from "@/components/home/PostGrid"
import Sidebar from "@/components/home/Sidebar"
import EventPopup from "@/components/home/EventPopup"
import {
  getPosts,
  getCategories,
  getTags,
} from "@/lib/notion/getPosts"
import { safeAsync } from "@/lib/utils/safeAsync"

type Props = {
  posts: Awaited<ReturnType<typeof getPosts>>
  categories: Awaited<ReturnType<typeof getCategories>>
  tags: Awaited<ReturnType<typeof getTags>>
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const props = await safeAsync(
    async () => {
      const [posts, categories, tags] = await Promise.all([
        getPosts(),
        getCategories(),
        getTags(),
      ])
      return { posts, categories, tags }
    },
    { posts: [], categories: [], tags: [] },
    "home"
  )
  return { props }
}

export default function HomePage({
  posts,
  categories,
  tags,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // URL `?category=...&tag=...` → state 동기화.
  // 첫 마운트와 글에서 뒤로가기로 돌아오는 경우 모두 이 effect 가 잡습니다.
  useEffect(() => {
    if (!router.isReady) return
    const c =
      typeof router.query.category === "string" ? router.query.category : null
    const t = typeof router.query.tag === "string" ? router.query.tag : null
    setActiveCategory(c)
    setActiveTag(t)
  }, [router.isReady, router.query.category, router.query.tag])

  // state → URL 동기화 (사용자가 필터 클릭한 직후).
  // 현재 URL 의 쿼리와 같으면 router.replace 를 호출하지 않아 무한 루프를 방지합니다.
  useEffect(() => {
    if (!router.isReady) return
    const sameCategory = (router.query.category ?? null) === (activeCategory ?? null)
    const sameTag = (router.query.tag ?? null) === (activeTag ?? null)
    if (sameCategory && sameTag) return
    const query: Record<string, string> = {}
    if (activeCategory) query.category = activeCategory
    if (activeTag) query.tag = activeTag
    router.replace(
      { pathname: "/", query },
      undefined,
      { scroll: false, shallow: true }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, activeTag, router.isReady])

  // Sidebar 의 양쪽 콜백(onCategoryChange, onTagChange) 호출이 같은 이벤트
  // 안에서 일어나도 React 18 자동 batching 으로 한 번에 처리됩니다.
  // 여기서 mutual exclusion 만 한 번 더 보강.
  const onCategoryChange = (next: string | null) => {
    setActiveCategory(next)
    if (next !== null) setActiveTag(null)
  }
  const onTagChange = (next: string | null) => {
    setActiveTag(next)
    if (next !== null) setActiveCategory(null)
  }

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (activeCategory && !p.category.includes(activeCategory)) return false
      if (activeTag && !p.tags.includes(activeTag)) return false
      return true
    })
  }, [posts, activeCategory, activeTag])

  const hasSidebar = categories.length > 0 || tags.length > 0
  const filterTitle = activeCategory
    ? activeCategory
    : activeTag
      ? `# ${activeTag}`
      : "전체 글"

  return (
    <Layout>
      <EventPopup />
      <div className="container mx-auto pt-8 pb-24">
        <Banner />
        <div
          className={
            hasSidebar
              ? "grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-12"
              : ""
          }
        >
          {hasSidebar && (
            <Sidebar
              categories={categories}
              tags={tags}
              totalPosts={posts.length}
              activeCategory={activeCategory}
              activeTag={activeTag}
              onCategoryChange={onCategoryChange}
              onTagChange={onTagChange}
            />
          )}

          <div className="min-w-0">
            {posts.length === 0 ? (
              <div className="py-24 text-center">
                <div className="text-2xl font-bold tracking-tight">잠시만 기다려주세요.</div>
              </div>
            ) : (
              <PostGrid posts={filtered} title={filterTitle} />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
