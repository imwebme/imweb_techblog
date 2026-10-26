// 한국 시간(KST, UTC+9) 기준 다음 자정까지 남은 ms.
//
// 방문자 컴퓨터의 시간대와 상관없이 "한국 날짜가 바뀌는 순간"을 기준으로 삼는다.
// KST 는 서머타임이 없어 항상 UTC+9 고정이라 오프셋 계산만으로 충분하다.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000

export const msUntilNextKstMidnight = (now: number = Date.now()): number => {
  // KST 벽시계 기준으로 옮겨 날짜 경계를 구한 뒤 다시 UTC 로 되돌린다.
  const kstNow = now + KST_OFFSET_MS
  const nextKstMidnight = Math.floor(kstNow / DAY_MS) * DAY_MS + DAY_MS
  return nextKstMidnight - KST_OFFSET_MS - now
}
