import { useEffect, useRef, useState } from "react"

// 커버/썸네일 이미지를 표시하되, src 가 없거나(=null) 로드에 실패(404 등)하면
// 제목 이니셜이 들어간 그라데이션 placeholder 로 graceful 하게 대체합니다.
//
// 외부 호스트(노션 프록시 / GitHub Pages)의 이미지가 죽어도 깨진 이미지 아이콘이
// 노출되지 않도록 하는 것이 목적입니다. sizing 은 부모가 감싸는 컨테이너에서 잡고,
// 이 컴포넌트는 그 안을 100% 채웁니다.
type CoverImageProps = {
  src?: string | null
  alt: string
  /** placeholder 에 표시할 이니셜의 출처 (보통 글 제목) */
  title: string
  /** <img> 에 적용할 클래스 */
  className?: string
  /** placeholder 컨테이너에 적용할 클래스 (그라데이션 등) */
  placeholderClassName?: string
  /** placeholder 이니셜 텍스트에 적용할 클래스 */
  initialsClassName?: string
  /** 이니셜 글자 수 (기본 2) */
  initialsLength?: number
}

export default function CoverImage({
  src,
  alt,
  title,
  className,
  placeholderClassName,
  initialsClassName,
  initialsLength = 2,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // SSR/정적 HTML 로 먼저 그려진 이미지가 hydration 이전에 404 로 실패하면,
  // onError 리스너가 붙기 전에 error 이벤트가 지나가 버려 놓칠 수 있습니다.
  // 마운트 시점에 이미 로드 실패(complete && naturalWidth===0)인지 직접 확인합니다.
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true)
    }
  }, [src])

  if (!src || failed) {
    return (
      <div className={placeholderClassName}>
        <span className={initialsClassName}>{title.slice(0, initialsLength)}</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
