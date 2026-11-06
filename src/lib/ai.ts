import type { Accent, Difficulty, Idea } from '../types'
import { clampDifficulty, createSeed, ideaCode } from './generator'

const API_KEY = import.meta.env.AI_PROVIDER_API_KEY?.trim() ?? ''
const PRIMARY_MODEL = import.meta.env.AI_PROVIDER_MODEL?.trim() || 'gemini-3.1-flash-lite'
const FALLBACK_MODEL = 'gemini-3.1-flash-lite'
const MODELS =
  PRIMARY_MODEL === FALLBACK_MODEL ? [PRIMARY_MODEL] : [PRIMARY_MODEL, FALLBACK_MODEL]
const REQUEST_TIMEOUT = 20_000

const ACCENTS: Accent[] = ['lime', 'coral', 'violet', 'sky', 'sun', 'mint']

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

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function buildPrompt(): string {
  return [
    'Eres un generador de ideas para proyectos web.',
    'Crea una idea original desde cero, sin usar plantillas, catálogos ni listas predefinidas.',
    'Responde solo con JSON válido con este formato:',
    '{"type": "string", "theme": "string", "title": "string", "description": "string", "features": ["string"], "difficulty": 1}',
    'Reglas:',
    '- type: formato del proyecto en 1-3 palabras (por ejemplo, "Landing page", "Micro-SaaS", "Juego web", "Dashboard").',
    '- theme: nicho o tema concreto en 2-5 palabras.',
    '- title: máximo 9 palabras, en español, sin comillas ni emojis.',
    '- description: 2 o 3 frases claras que expliquen qué es la app, para quién es y qué problema resuelve.',
    '- features: entre 4 y 6 cosas que el proyecto tiene que tener. Cada una debe explicar qué incluye y para qué sirve, en una frase accionable.',
    '- difficulty: 1 si es fácil, 2 si es medio, 3 si es ambicioso.',
    '- No menciones stacks, frameworks, librerías ni restricciones de diseño.',
  ].join('\n')
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

async function requestIdea(model: string): Promise<GeneratedIdea> {
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
          contents: [{ role: 'user', parts: [{ text: buildPrompt() }] }],
          generationConfig: {
            temperature: 1.2,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
          },
        }),
      },
    )

    if (!response.ok) throw new Error(`ai-request-failed:${response.status}`)

    const data = (await response.json()) as GeminiResponse
    const text =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? ''

    return parseIdea(text)
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function generateAIIdea(): Promise<Idea> {
  if (!API_KEY) throw new Error('missing-ai-api-key')

  let lastError: unknown

  for (const model of MODELS) {
    try {
      const generated = await requestIdea(model)
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
      }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('ai-unavailable')
}
