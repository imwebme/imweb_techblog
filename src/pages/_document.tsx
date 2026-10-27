import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {/* Pretendard 웹폰트. 예전엔 globals.css 안에서 @import 했는데, 빌드하면
            @tailwind 가 펼친 규칙들 뒤로 밀려 CSS 한가운데에 놓였다. @import 는
            맨 앞에 있어야만 유효해서 브라우저가 무시했고, 폰트가 아예 안 불러와졌다.
            HTML 머리에서 바로 요청하면 그 문제도 없고, 사이트 CSS 를 다 받기
            전부터 폰트를 내려받기 시작해 글자도 빨리 뜬다. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </Head>
      <body className="bg-base text-ink-900 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
