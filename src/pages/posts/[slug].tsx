import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import Head from "next/head"
import Link from "next/link"
import type { ExtendedRecordMap } from "notion-types"
import Layout from "@/components/layout/Layout"
import PostHeader from "@/components/post/PostHeader"
import PostContent from "@/components/post/PostContent"
import PostActions from "@/components/post/PostActions"
import Comments from "@/components/post/Comments"
import { getPostBySlug } from "@/lib/notion/getPostBySlug"
import { getPosts } from "@/lib/notion/getPosts"
import { safeAsync } from "@/lib/utils/safeStatic"
import type { TPost } from "@/types"

const CONFIG = require("../../../site.config")

type Props = {
  post: TPost
  recordMap: ExtendedRecordMap
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await safeAsync(() => getPosts(), [], "posts/[slug]")
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = (params?.slug as string) || ""
  const result = await getPostBySlug(slug)
  if (!result) return { notFound: true }
  const { recordMap, ...post } = result
  return { props: { post, recordMap } }
}

export default function PostPage({
  post,
  recordMap,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const ogTitle = `${post.title} — ${CONFIG.blog.title}`
  return (
    <Layout>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={post.summary || CONFIG.blog.description} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={post.summary || CONFIG.blog.description} />
        {post.cover && <meta property="og:image" content={post.cover} />}
        <meta property="og:type" content="article" />
      </Head>
      <PostHeader post={post} />
      <PostContent recordMap={recordMap} />
      <PostActions post={post} />
      <Comments />

      <div className="container mx-auto max-w-prose pb-24 text-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-ink-700 hover:text-ink-900"
        >
          ← 모든 글 보기
        </Link>
      </div>
    </Layout>
  )
}
