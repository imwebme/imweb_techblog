import { describe, it, expect } from "vitest"
import { msUntilNextKstMidnight } from "./kstMidnight"

const H = 60 * 60 * 1000

describe("msUntilNextKstMidnight", () => {
  it("KST 오후 11시면 1시간 남는다", () => {
    // 2026-10-27 23:00 KST = 2026-10-27 14:00 UTC
    expect(msUntilNextKstMidnight(Date.UTC(2026, 9, 27, 14, 0))).toBe(1 * H)
  })

  it("KST 자정 직후면 거의 하루가 남는다", () => {
    // 2026-10-28 00:00:01 KST = 2026-10-27 15:00:01 UTC
    expect(msUntilNextKstMidnight(Date.UTC(2026, 9, 27, 15, 0, 1))).toBe(24 * H - 1000)
  })

  it("UTC 로는 같은 날이어도 KST 날짜 기준으로 계산한다", () => {
    // 2026-10-27 20:00 UTC = 2026-10-28 05:00 KST → KST 자정까지 19시간
    expect(msUntilNextKstMidnight(Date.UTC(2026, 9, 27, 20, 0))).toBe(19 * H)
  })

  it("정확히 KST 자정이면 다음 자정까지 24시간", () => {
    // 2026-10-28 00:00 KST = 2026-10-27 15:00 UTC
    expect(msUntilNextKstMidnight(Date.UTC(2026, 9, 27, 15, 0))).toBe(24 * H)
  })
})
