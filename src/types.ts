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

export interface Idea {
  id: string
  seed: number
  type: ProjectType
  theme: Theme
  title: string
  pitch: string
  features: string[]
  difficulty: Difficulty
  source: 'ai' | 'local'
}

export interface HistoryEntry {
  idea: Idea
  createdAt: number
}
