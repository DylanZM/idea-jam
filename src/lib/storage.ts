import type { HistoryEntry, Idea } from '../types'

export const HISTORY_KEY = 'ideajam.history.v3'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isValidIdea(value: unknown): value is Idea {
  if (!isRecord(value)) return false
  const { id, seed, type, theme, title, description, features, difficulty, accent, language } =
    value
  if (language !== undefined && language !== 'es' && language !== 'en') return false
  return (
    typeof id === 'string' &&
    typeof seed === 'number' &&
    Number.isFinite(seed) &&
    typeof type === 'string' &&
    typeof theme === 'string' &&
    typeof title === 'string' &&
    typeof description === 'string' &&
    Array.isArray(features) &&
    features.every((feature) => typeof feature === 'string') &&
    typeof difficulty === 'number' &&
    typeof accent === 'string'
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
    }
    return entries
  } catch {
    return []
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
  } catch {
    // History is a nice-to-have: private mode or a full quota should not break the app.
  }
}

export function addHistoryEntry(entries: HistoryEntry[], idea: Idea): HistoryEntry[] {
  const next = [{ idea, createdAt: Date.now() }, ...entries.filter((entry) => entry.idea.seed !== idea.seed)]
  saveHistory(next)
  return next
}

export function updateHistoryEntry(entries: HistoryEntry[], idea: Idea): HistoryEntry[] {
  const next = entries.map((entry) =>
    entry.idea.seed === idea.seed ? { ...entry, idea } : entry,
  )
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
