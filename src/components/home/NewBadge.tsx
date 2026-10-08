import { useEffect, useState } from "react"

// 발행 후 이 기간 동안 NEW 배지를 노출한다.
export const NEW_DAYS = 14

const DAY_MS = 24 * 60 * 60 * 1000

// date 는 "YYYY-MM-DD". 발행일 자정(로컬) 기준으로 경과 시간을 잰다.
export const isWithinNewWindow = (date: string, now: number): boolean => {
  if (!date) return false
  const published = Date.parse(`${date}T00:00:00`)
  if (Number.isNaN(published)) return false
  return now - published < NEW_DAYS * DAY_MS
}

export default function NewBadge({ date }: { date: string }) {
  // 정적 export 라 서버 HTML 은 빌드 시점에 고정된다. 빌드와 열람 시점이
  // 14일 경계를 사이에 두면 서버/클라이언트 결과가 달라져 hydration 이
  // 깨지므로, 마운트 후 브라우저 시계로만 판정한다.
  const [show, setShow] = useState(false)
  useEffect(() => {
    setShow(isWithinNewWindow(date, Date.now()))
  }, [date])

  if (!show) return null

  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold leading-none tracking-wide text-white"
      title={`최근 ${NEW_DAYS}일 이내 발행`}
    >
      NEW
    </span>
  )
}
