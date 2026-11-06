import { useCallback, useEffect, useMemo, useState } from 'react'
import { rateSnapshot, recordUse, refundUse } from '../lib/rateLimit'

export function useRateLimit() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1_000)
    return () => window.clearInterval(tick)
  }, [])

  const snapshot = useMemo(() => rateSnapshot(now), [now])

  const check = useCallback(() => rateSnapshot(), [])

  const consume = useCallback(() => {
    const stamp = recordUse()
    setNow(Date.now())
    return stamp
  }, [])

  const refund = useCallback((stamp: number) => {
    refundUse(stamp)
    setNow(Date.now())
  }, [])

  return { snapshot, check, consume, refund }
}
