export type Accent = 'lime' | 'coral' | 'violet' | 'sky' | 'sun' | 'mint'
export type Difficulty = 1 | 2 | 3

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
