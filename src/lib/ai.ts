import type { Accent, Difficulty, Idea, Language } from '../types'
import { clampDifficulty, createSeed, ideaCode } from './generator'

const API_KEY = import.meta.env.AI_PROVIDER_API_KEY?.trim() ?? ''
const PRIMARY_MODEL = import.meta.env.AI_PROVIDER_MODEL?.trim() || 'gemini-3.1-flash-lite'
const FALLBACK_MODEL = 'gemini-3.1-flash-lite'
const MODELS =
  PRIMARY_MODEL === FALLBACK_MODEL ? [PRIMARY_MODEL] : [PRIMARY_MODEL, FALLBACK_MODEL]
const REQUEST_TIMEOUT = 20_000

const ACCENTS: Accent[] = ['lime', 'coral', 'violet', 'sky', 'sun', 'mint']

const DIRECTIONS = [
  'Combine two industries that almost never meet.',
  'Imagine a tool for a very specific craft.',
  'Turn a boring task into something addictive.',
  'Design for a small but passionate group.',
  'Solve a problem for a local community.',
  'Start from an absurd constraint and build around it.',
  'Mix a physical experience with a screen.',
  'Think of something you would use every morning.',
  'Make visible something people usually ignore.',
  'Turn a niche hobby into a serious tool.',
]

export type AvoidIdea = {
  type: string
  theme: string
  title: string
}

export type GenerateOptions = {
  language: Language
  avoid?: AvoidIdea[]
}

export class RateLimitError extends Error {
  constructor() {
    super('ai-rate-limit')
    this.name = 'RateLimitError'
  }
}

export class MissingKeyError extends Error {
  constructor() {
    super('missing-ai-api-key')
    this.name = 'MissingKeyError'
  }
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

type GeneratedIdea = {
  type: string
  theme: string
  title: string
  description: string
  features: string[]
  difficulty: Difficulty
}

type IdeaTranslation = Omit<GeneratedIdea, 'difficulty'>

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    type: { type: 'STRING' },
    theme: { type: 'STRING' },
    title: { type: 'STRING' },
    description: { type: 'STRING' },
    features: { type: 'ARRAY', items: { type: 'STRING' } },
    difficulty: { type: 'INTEGER' },
  },
  required: ['type', 'theme', 'title', 'description', 'features', 'difficulty'],
}

const TRANSLATION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    type: { type: 'STRING' },
    theme: { type: 'STRING' },
    title: { type: 'STRING' },
    description: { type: 'STRING' },
    features: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['type', 'theme', 'title', 'description', 'features'],
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'that',
  'this',
  'your',
  'you',
  'una',
  'uno',
  'unos',
  'unas',
  'para',
  'con',
  'por',
  'del',
  'las',
  'los',
  'que',
  'como',
  'una',
  'sobre',
  'desde',
])

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
}

function jaccard(a: string[], b: string[]): number {
  if (a.length === 0 || b.length === 0) return 0
  const first = new Set(a)
  const second = new Set(b)
  let shared = 0
  for (const word of first) {
    if (second.has(word)) shared += 1
  }
  return shared / (first.size + second.size - shared)
}

function tooSimilar(candidate: GeneratedIdea, avoid: AvoidIdea[]): boolean {
  const candidateTitle = tokens(candidate.title)
  const candidateTheme = tokens(candidate.theme)
  const candidateType = tokens(candidate.type)

  return avoid.some((previous) => {
    const titleScore = jaccard(candidateTitle, tokens(previous.title))
    const themeScore = jaccard(candidateTheme, tokens(previous.theme))
    const typeScore = jaccard(candidateType, tokens(previous.type))

    return (
      titleScore >= 0.7 ||
      (typeScore >= 0.65 && themeScore >= 0.6) ||
      (titleScore >= 0.5 && themeScore >= 0.65)
    )
  })
}

function buildPrompt(options: GenerateOptions): string {
  const { language, avoid = [] } = options
  const languageName = language === 'en' ? 'English' : 'Spanish'
  const directionA = pickRandom(DIRECTIONS)
  const directionB = pickRandom(DIRECTIONS)

  const avoidBlock =
    avoid.length > 0
      ? [
          'These ideas were already generated. Do not repeat or imitate them:',
          ...avoid
            .slice(0, 10)
            .map((idea) => `- ${idea.type}: ${idea.title} — ${idea.theme}`),
          'Pick a clearly different format and a clearly different niche.',
        ].join('\n')
      : ''

  return [
    'You are a generator of original ideas for web projects.',
    'Create something new from scratch, without templates, catalogs or predefined lists.',
    `Write every field in natural ${languageName}. Do not use any other language.`,
    'Respond only with valid JSON in this shape:',
    '{"type": "string", "theme": "string", "title": "string", "description": "string", "features": ["string"], "difficulty": 1}',
    'Rules:',
    '- type: project format in 1-3 words (for example, "Landing page", "Micro-SaaS", "Web game", "Dashboard").',
    '- theme: a specific niche or topic in 2-5 words.',
    '- title: maximum 9 words, no quotes or emojis, and the most specific and surprising part first.',
    '- description: 2 or 3 clear sentences explaining what the app is, who it is for and what problem it solves.',
    '- features: between 4 and 6 things the project must have. Each one explains what it includes and why it matters in one actionable sentence.',
    '- difficulty: 1 if easy, 2 if medium, 3 if ambitious.',
    '- Do not mention stacks, frameworks, libraries or visual constraints.',
    '- Be concrete and unusual. Avoid generic ideas about productivity, fitness or social networks.',
    'Creative directions to explore:',
    `- ${directionA}`,
    `- ${directionB}`,
    avoidBlock,
  ]
    .filter(Boolean)
    .join('\n')
}

function parseIdea(raw: string): GeneratedIdea {
  const parsed: unknown = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object') throw new Error('invalid-ai-response')

  const { type, theme, title, description, features, difficulty } = parsed as Record<
    string,
    unknown
  >
  if (
    typeof type !== 'string' ||
    typeof theme !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    !Array.isArray(features)
  ) {
    throw new Error('invalid-ai-response')
  }

  const cleanFeatures = features
    .filter((feature): feature is string => typeof feature === 'string')
    .map((feature) => feature.trim())
    .filter(Boolean)
    .slice(0, 6)

  if (
    !type.trim() ||
    !theme.trim() ||
    !title.trim() ||
    !description.trim() ||
    cleanFeatures.length < 3
  ) {
    throw new Error('invalid-ai-response')
  }

  return {
    type: type.trim(),
    theme: theme.trim(),
    title: title.trim(),
    description: description.trim(),
    features: cleanFeatures,
    difficulty:
      typeof difficulty === 'number' && Number.isFinite(difficulty)
        ? clampDifficulty(difficulty)
        : 2,
  }
}

function parseTranslation(raw: string): IdeaTranslation {
  const parsed: unknown = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object') throw new Error('invalid-ai-response')

  const { type, theme, title, description, features } = parsed as Record<string, unknown>
  if (
    typeof type !== 'string' ||
    typeof theme !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    !Array.isArray(features)
  ) {
    throw new Error('invalid-ai-response')
  }

  const cleanFeatures = features
    .filter((feature): feature is string => typeof feature === 'string')
    .map((feature) => feature.trim())
    .filter(Boolean)

  if (!type.trim() || !theme.trim() || !title.trim() || !description.trim()) {
    throw new Error('invalid-ai-response')
  }
  if (cleanFeatures.length === 0) throw new Error('invalid-ai-response')

  return {
    type: type.trim(),
    theme: theme.trim(),
    title: title.trim(),
    description: description.trim(),
    features: cleanFeatures,
  }
}

function buildTranslationPrompt(idea: Idea, language: Language): string {
  const languageName = language === 'en' ? 'English' : 'Spanish'
  const original = {
    type: idea.type,
    theme: idea.theme,
    title: idea.title,
    description: idea.description,
    features: idea.features,
  }

  return [
    `Translate the following project brief into natural ${languageName}.`,
    'Keep the same meaning, tone and level of detail. Do not invent, remove or reorder anything.',
    'Translate "type", "theme", "title", "description" and every item in "features".',
    'Respond only with valid JSON in this shape:',
    '{"type": "string", "theme": "string", "title": "string", "description": "string", "features": ["string"]}',
    'Original brief:',
    JSON.stringify(original, null, 2),
  ].join('\n')
}

async function requestTranslation(
  model: string,
  idea: Idea,
  language: Language,
): Promise<IdeaTranslation> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: buildTranslationPrompt(idea, language) }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: TRANSLATION_SCHEMA,
          },
        }),
      },
    )

    if (response.status === 429) throw new RateLimitError()
    if (response.status === 401 || response.status === 403) throw new MissingKeyError()
    if (!response.ok) throw new Error(`ai-request-failed:${response.status}`)

    const data = (await response.json()) as GeminiResponse
    const text =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? ''

    return parseTranslation(text)
  } finally {
    window.clearTimeout(timeout)
  }
}

async function requestIdea(model: string, options: GenerateOptions): Promise<GeneratedIdea> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: buildPrompt(options) }] }],
          generationConfig: {
            temperature: 1.35,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      },
    )

    if (response.status === 429) throw new RateLimitError()
    if (response.status === 401 || response.status === 403) throw new MissingKeyError()
    if (!response.ok) throw new Error(`ai-request-failed:${response.status}`)

    const data = (await response.json()) as GeminiResponse
    const text =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? ''

    return parseIdea(text)
  } finally {
    window.clearTimeout(timeout)
  }
}

async function requestUniqueIdea(
  model: string,
  options: GenerateOptions,
): Promise<GeneratedIdea> {
  const avoid = options.avoid ?? []
  let candidate = await requestIdea(model, options)

  if (avoid.length > 0 && tooSimilar(candidate, avoid)) {
    candidate = await requestIdea(model, options)
  }

  return candidate
}

export async function generateAIIdea(options: GenerateOptions): Promise<Idea> {
  if (!API_KEY) throw new MissingKeyError()

  let lastError: unknown

  for (const model of MODELS) {
    try {
      const generated = await requestUniqueIdea(model, options)
      const seed = createSeed()

      return {
        id: ideaCode(seed),
        seed,
        type: generated.type,
        theme: generated.theme,
        title: generated.title,
        description: generated.description,
        features: generated.features,
        difficulty: generated.difficulty,
        accent: pickRandom(ACCENTS),
        language: options.language,
      }
    } catch (error) {
      if (error instanceof RateLimitError || error instanceof MissingKeyError) throw error
      lastError = error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('ai-unavailable')
}

export async function translateIdea(idea: Idea, language: Language): Promise<Idea> {
  if (idea.language === language) return idea
  if (!API_KEY) throw new MissingKeyError()

  let lastError: unknown

  for (const model of MODELS) {
    try {
      const translated = await requestTranslation(model, idea, language)
      return { ...idea, ...translated, language }
    } catch (error) {
      if (error instanceof RateLimitError || error instanceof MissingKeyError) throw error
      lastError = error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('ai-unavailable')
}
