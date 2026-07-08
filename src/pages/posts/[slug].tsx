import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"
import Head from "next/head"
import Link from "next/link"
import type { ExtendedRecordMap } from "notion-types"
import Layout from "@/components/layout/Layout"
import PostHeader from "@/components/post/PostHeader"
import PostContent from "@/components/post/PostContent"
import PostActions from "@/components/post/PostActions"
import PostNavigation, { type AdjacentPost } from "@/components/post/PostNavigation"
import Comments from "@/components/post/Comments"
import { getPostBySlug } from "@/lib/notion/getPostBySlug"
import { getPosts } from "@/lib/notion/getPosts"
import { safeAsync } from "@/lib/utils/safeAsync"
import type { TPost } from "@/types"

const CONFIG = require("../../../site.config")

type Props = {
  post: TPost
  recordMap: ExtendedRecordMap
  prev: AdjacentPost
  next: AdjacentPost
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

  // 인접 글 계산 — getPosts 는 최신순 반환.
  // idx 0 이 가장 최신, idx length-1 이 가장 예전.
  const posts = await safeAsync(() => getPosts(), [] as TPost[], `posts/${slug}/nav`)
  const idx = posts.findIndex((p) => p.slug === slug)
  const pickAdj = (p: TPost | undefined): AdjacentPost =>
    p ? { slug: p.slug, title: p.title } : null
  const next = idx > 0 ? pickAdj(posts[idx - 1]) : null // 더 최신
  const prev = idx >= 0 && idx < posts.length - 1 ? pickAdj(posts[idx + 1]) : null // 더 예전
  return { props: { post, recordMap, prev, next } }
}

export default function PostPage({
  post,
  recordMap,
  prev,
  next,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const ogTitle = `${post.title} — ${CONFIG.blog.title}`
  const ogDescription = post.summary || CONFIG.blog.description
  // og:image 는 절대 URL 이어야 슬랙·페이스북 등 파서가 안정적으로 인식.
  // post.cover 는 노션 thumbnail 컬럼의 URL — 운영자가 절대 URL 로 박는다는 전제.
  // 비어 있으면 사이트 디폴트 OG 이미지로 fallback.
  const ogImage = post.cover || `${CONFIG.blog.siteUrl}/OG_imweb_tech.png`
  const ogUrl = `${CONFIG.blog.siteUrl}/posts/${post.slug}/`
  return (
    <Layout>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDescription} key="description" />
        <meta property="og:title" content={ogTitle} key="og:title" />
        <meta property="og:description" content={ogDescription} key="og:description" />
        <meta property="og:type" content="article" key="og:type" />
        <meta property="og:url" content={ogUrl} key="og:url" />
        <meta property="og:image" content={ogImage} key="og:image" />
        <meta name="twitter:title" content={ogTitle} key="twitter:title" />
        <meta name="twitter:description" content={ogDescription} key="twitter:description" />
        <meta name="twitter:image" content={ogImage} key="twitter:image" />
      </Head>
      <PostHeader post={post} />
      <PostContent recordMap={recordMap} />
      <PostActions post={post} />
      <PostNavigation prev={prev} next={next} />
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
