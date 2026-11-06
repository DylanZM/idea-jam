import type { RateLimitReason } from '../types'

export const RATE_LIMITS = {
  minute: 5,
  day: 100,
  cooldownMs: 5_000,
} as const

const STORAGE_KEY = 'ideajam.rate.v1'
const MINUTE_MS = 60_000
const DAY_MS = 24 * 60 * 60 * 1000

export type RateSnapshot = {
  allowed: boolean
  reason: RateLimitReason | null
  minuteUsed: number
  dayUsed: number
  cooldownSeconds: number
  minuteLimit: number
  dayLimit: number
}

function readUsage(now: number): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const cutoff = now - DAY_MS
    return parsed
      .filter(
        (value): value is number =>
          typeof value === 'number' && Number.isFinite(value) && value > cutoff && value <= now + 1_000,
      )
      .sort((a, b) => a - b)
  } catch {
    return []
  }
}

function writeUsage(usage: number[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usage))
  } catch {
    // Rate limiting still works for the current session when storage is unavailable.
  }
}

export function rateSnapshot(now = Date.now()): RateSnapshot {
  const usage = readUsage(now)
  const minuteUsed = usage.filter((timestamp) => now - timestamp < MINUTE_MS).length
  const dayUsed = usage.length

  const lastUsed = usage.length > 0 ? usage[usage.length - 1] : 0
  const waitMs = lastUsed > 0 ? Math.max(0, RATE_LIMITS.cooldownMs - (now - lastUsed)) : 0

  let reason: RateLimitReason | null = null
  if (dayUsed >= RATE_LIMITS.day) reason = 'day'
  else if (minuteUsed >= RATE_LIMITS.minute) reason = 'minute'
  else if (waitMs > 0) reason = 'cooldown'

  return {
    allowed: reason === null,
    reason,
    minuteUsed,
    dayUsed,
    cooldownSeconds: Math.ceil(waitMs / 1_000),
    minuteLimit: RATE_LIMITS.minute,
    dayLimit: RATE_LIMITS.day,
  }
}

export function recordUse(now = Date.now()): number {
  const usage = readUsage(now)
  usage.push(now)
  writeUsage(usage)
  return now
}

export function refundUse(stamp: number): void {
  const usage = readUsage(Date.now())
  const index = usage.lastIndexOf(stamp)
  if (index === -1) return
  usage.splice(index, 1)
  writeUsage(usage)
}
