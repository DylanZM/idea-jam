import type { HistoryEntry } from '../types'

export const HISTORY_KEY = 'ideajam.history.v1'
export const HISTORY_LIMIT = 10

function isValidEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.seed === 'number' &&
    Number.isFinite(entry.seed) &&
    typeof entry.createdAt === 'number' &&
    Number.isFinite(entry.createdAt)
  )
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    const seen = new Set<number>()
    const entries: HistoryEntry[] = []
    for (const item of parsed) {
      if (!isValidEntry(item) || seen.has(item.seed)) continue
      seen.add(item.seed)
      entries.push(item)
      if (entries.length === HISTORY_LIMIT) break
    }
    return entries
  } catch {
    return []
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)))
  } catch {
    // History is a nice-to-have: private mode or a full quota should not break the app.
  }
}

export function addHistoryEntry(entries: HistoryEntry[], seed: number): HistoryEntry[] {
  const next = [
    { seed, createdAt: Date.now() },
    ...entries.filter((entry) => entry.seed !== seed),
  ].slice(0, HISTORY_LIMIT)
  saveHistory(next)
  return next
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(HISTORY_KEY)
  } catch {
    // Nothing to do if storage is unavailable.
  }
}
