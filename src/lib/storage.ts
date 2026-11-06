import type { HistoryEntry, Idea } from '../types'

export const HISTORY_KEY = 'ideajam.history.v2'
export const HISTORY_LIMIT = 10

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isValidIdea(value: unknown): value is Idea {
  if (!isRecord(value)) return false
  const { id, seed, type, theme, title, pitch, features, difficulty } = value
  return (
    typeof id === 'string' &&
    typeof seed === 'number' &&
    Number.isFinite(seed) &&
    isRecord(type) &&
    typeof type.id === 'string' &&
    typeof type.label === 'string' &&
    typeof type.slot === 'string' &&
    typeof type.color === 'string' &&
    isRecord(theme) &&
    typeof theme.id === 'string' &&
    typeof theme.label === 'string' &&
    typeof title === 'string' &&
    typeof pitch === 'string' &&
    Array.isArray(features) &&
    features.every((feature) => typeof feature === 'string') &&
    typeof difficulty === 'number'
  )
}

function isValidEntry(value: unknown): value is HistoryEntry {
  if (!isRecord(value)) return false
  return (
    typeof value.createdAt === 'number' &&
    Number.isFinite(value.createdAt) &&
    isValidIdea(value.idea)
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
      if (!isValidEntry(item) || seen.has(item.idea.seed)) continue
      seen.add(item.idea.seed)
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

export function addHistoryEntry(entries: HistoryEntry[], idea: Idea): HistoryEntry[] {
  const next = [
    { idea, createdAt: Date.now() },
    ...entries.filter((entry) => entry.idea.seed !== idea.seed),
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
