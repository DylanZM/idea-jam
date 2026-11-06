import type { Language } from '../types'

const formatters = new Map<Language, Intl.RelativeTimeFormat>()

function relative(language: Language): Intl.RelativeTimeFormat {
  const existing = formatters.get(language)
  if (existing) return existing
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto', style: 'short' })
  formatters.set(language, formatter)
  return formatter
}

export function timeAgo(timestamp: number, language: Language): string {
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000))
  const format = relative(language)

  if (seconds < 45) return format.format(0, 'second')
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return format.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (hours < 24) return format.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  if (days < 30) return format.format(-days, 'day')
  return new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short' }).format(timestamp)
}
