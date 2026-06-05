import "react-notion-x/src/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import "katex/dist/katex.min.css"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { withBasePath } from "@/lib/utils/withBasePath"
import Analytics from "@/components/common/Analytics"

const CONFIG = require("../../site.config")

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content={CONFIG.brand.primary} />
        <meta name="google-site-verification" content="eIlyGmoKucsv01nHB9zAG-U1tdvXMuV5hWL8bU6z_fo" />
        <title>{CONFIG.blog.title}</title>
        <meta name="description" content={CONFIG.blog.description} />
        <link rel="icon" type="image/webp" href={withBasePath("/symbol.webp")} />
        <link rel="apple-touch-icon" href={withBasePath("/symbol.webp")} />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={withBasePath("/feed.xml")}
          title={`${CONFIG.blog.title} RSS`}
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          href={withBasePath("/atom.xml")}
          title={`${CONFIG.blog.title} Atom`}
        />
        <meta property="og:title" content={CONFIG.blog.title} />
        <meta property="og:description" content={CONFIG.blog.description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:site_name" content={CONFIG.blog.title} />
        <meta property="og:image" content={`${CONFIG.blog.siteUrl}/OG_imweb_tech.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${CONFIG.blog.siteUrl}/OG_imweb_tech.png`} />
        {/*
          JSON-LD 구조화 데이터.
          - WebSite: 사이트명·별칭(검색 매칭에 핵심)·검색 액션을 명시
          - Organization: 회사 정체성 — 지식 그래프 후보가 됩니다
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: CONFIG.blog.title,
              alternateName: CONFIG.blog.alternateNames,
              url: CONFIG.blog.siteUrl,
              description: CONFIG.blog.description,
              inLanguage: CONFIG.blog.language,
              potentialAction: {
                "@type": "SearchAction",
                target: `${CONFIG.blog.siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: CONFIG.company.name,
              alternateName: "아임웹",
              url: CONFIG.social.homepage,
              logo: `${CONFIG.blog.siteUrl}/Logo_ImwebTech_black.svg`,
              sameAs: [CONFIG.social.careers, CONFIG.blog.siteUrl],
            }),
          }}
        />
      </Head>
      <Analytics />
      <Component {...pageProps} />
    </>
  )
}
