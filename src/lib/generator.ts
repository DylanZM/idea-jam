import type { Difficulty } from '../types'

let seedCounter = 0

export function createSeed(): number {
  seedCounter = (seedCounter + 1) % 10_000
  const time = Date.now() >>> 0
  const mixed = Math.imul(seedCounter + 1, 0x9e3779b1) >>> 0
  const random = Math.floor(Math.random() * 0xffffffff) >>> 0
  return (time ^ mixed ^ random) >>> 0
}

export function clampDifficulty(value: number): Difficulty {
  return Math.min(3, Math.max(1, Math.round(value))) as Difficulty
}

export function difficultyLabel(value: Difficulty): string {
  if (value === 1) return 'Fácil'
  if (value === 2) return 'Medio'
  return 'Ambicioso'
}

export function ideaCode(seed: number): string {
  return seed.toString(36).toUpperCase().padStart(4, '0').slice(-4)
}
