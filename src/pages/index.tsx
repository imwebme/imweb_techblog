import type { GetStaticProps, InferGetStaticPropsType } from "next"
import { useMemo, useState } from "react"
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

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
              onCategoryChange={setActiveCategory}
              onTagChange={setActiveTag}
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
