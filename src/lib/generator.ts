import { GENERIC_FEATURES, PROJECT_TYPES, STACKS, THEMES, TWISTS } from '../data/ideas'
import type { Difficulty, Idea } from '../types'

let seedCounter = 0

export function createSeed(): number {
  seedCounter = (seedCounter + 1) % 10_000
  const time = Date.now() >>> 0
  const mixed = Math.imul(seedCounter + 1, 0x9e3779b1) >>> 0
  const random = Math.floor(Math.random() * 0xffffffff) >>> 0
  return (time ^ mixed ^ random) >>> 0
}

function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296
  }
}

function pick<T>(random: () => number, items: T[]): T {
  return items[Math.floor(random() * items.length)]
}

function pickMany<T>(random: () => number, items: T[], count: number): T[] {
  const pool = [...items]
  const picked: T[] = []
  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length)
    picked.push(pool.splice(index, 1)[0])
  }
  return picked
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
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

export function generateIdea(seed = createSeed()): Idea {
  const random = mulberry32(seed)

  const type = pick(random, PROJECT_TYPES)
  const theme = pick(random, THEMES)
  const twist = pick(random, TWISTS)
  const stack = pick(random, STACKS)

  const values = {
    theme: theme.label,
    Theme: capitalize(theme.label),
    twist: twist.label,
  }

  const title = fill(pick(random, type.titles), values)
  const pitch = fill(pick(random, type.pitches), values)
  const features = [
    ...pickMany(random, type.features, 3),
    twist.feature,
    ...(random() > 0.55 ? pickMany(random, GENERIC_FEATURES, 1) : []),
  ]

  const difficulty = clampDifficulty((type.difficulty + stack.difficulty) / 2)

  return {
    id: ideaCode(seed),
    seed,
    type,
    theme,
    twist,
    stack,
    title,
    pitch,
    features,
    difficulty,
  }
}
