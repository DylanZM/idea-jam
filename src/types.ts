export type Accent = 'lime' | 'coral' | 'violet' | 'sky' | 'sun' | 'mint'
export type Difficulty = 1 | 2 | 3

export interface ProjectType {
  id: string
  label: string
  slot: string
  color: Accent
  titles: string[]
  pitches: string[]
  features: string[]
  difficulty: Difficulty
}

export interface Theme {
  id: string
  label: string
}

export interface Twist {
  id: string
  label: string
  feature: string
}

export interface Stack {
  id: string
  label: string
  detail: string
  difficulty: Difficulty
}

export interface Idea {
  id: string
  seed: number
  type: ProjectType
  theme: Theme
  twist: Twist
  stack: Stack
  title: string
  pitch: string
  features: string[]
  difficulty: Difficulty
}

export interface HistoryEntry {
  seed: number
  createdAt: number
}
