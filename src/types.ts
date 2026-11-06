export type Accent = 'lime' | 'coral' | 'violet' | 'sky' | 'sun' | 'mint'
export type Difficulty = 1 | 2 | 3
export type Language = 'es' | 'en'
export type RateLimitReason = 'minute' | 'day' | 'cooldown'
export type GeneratorError = 'generic' | 'rate' | 'day' | 'missingKey'

export interface Idea {
  id: string
  seed: number
  type: string
  theme: string
  title: string
  description: string
  features: string[]
  difficulty: Difficulty
  accent: Accent
}

export interface HistoryEntry {
  idea: Idea
  createdAt: number
}
