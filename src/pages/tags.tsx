import type { GetStaticProps, InferGetStaticPropsType } from "next"
import Link from "next/link"
import Layout from "@/components/layout/Layout"
import { getPosts, getTags } from "@/lib/notion/getPosts"
import { safeAsync } from "@/lib/utils/safeStatic"

type Props = {
  tags: Awaited<ReturnType<typeof getTags>>
  total: number
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const props = await safeAsync(
    async () => {
      const [posts, tags] = await Promise.all([getPosts(), getTags()])
      return { tags, total: posts.length }
    },
    { tags: [], total: 0 },
    "tags"
  )
  return { props }
}

export default function TagsPage({
  tags,
  total,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <section className="container mx-auto pt-16 pb-16">
        <h1 className="text-h1 sm:text-[2.5rem] font-bold tracking-[-0.025em] text-ink-900">
          태그
        </h1>
        <p className="mt-3 text-ink-500">
          현재 {total}개의 글에서 추출된 {tags.length}개의 태그
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {tags.map((t) => (
            <Link
              key={t.name}
              href={`/?tag=${encodeURIComponent(t.name)}`}
              className="chip text-base"
            >
              # {t.name}
              <span className="opacity-60">·{t.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  )
}
