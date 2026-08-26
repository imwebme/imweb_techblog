import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </Head>
      <body className="bg-base text-ink-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
