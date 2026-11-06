import { PROJECT_TYPES, THEMES } from '../data/ideas'
import type { Idea } from '../types'
import { createSeed, ideaCode } from './generator'

const API_KEY = import.meta.env.AI_PROVIDER_API_KEY?.trim() ?? ''
const PRIMARY_MODEL = import.meta.env.AI_PROVIDER_MODEL?.trim() || 'gemini-3.1-flash-lite'
const FALLBACK_MODEL = 'gemini-3.1-flash-lite'
const MODELS =
  PRIMARY_MODEL === FALLBACK_MODEL ? [PRIMARY_MODEL] : [PRIMARY_MODEL, FALLBACK_MODEL]
const REQUEST_TIMEOUT = 20_000

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

type GeneratedBrief = {
  title: string
  pitch: string
  features: string[]
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    pitch: { type: 'STRING' },
    features: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['title', 'pitch', 'features'],
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function buildPrompt(type: string, theme: string): string {
  return [
    'Eres un generador de ideas para proyectos web.',
    `Propón una idea concreta y original para un proyecto de tipo "${type}" sobre "${theme}".`,
    'Responde solo con JSON válido con este formato:',
    '{"title": "string", "pitch": "string", "features": ["string"]}',
    'Reglas:',
    '- title: máximo 9 palabras, en español, sin comillas ni emojis.',
    '- pitch: una o dos frases concretas, sin relleno.',
    '- features: entre 4 y 6 funcionalidades específicas y accionables, cada una en una frase corta.',
    '- No menciones stacks, frameworks, librerías ni restricciones de diseño.',
  ].join('\n')
}

function parseBrief(raw: string): GeneratedBrief {
  const parsed: unknown = JSON.parse(raw)
  if (!parsed || typeof parsed !== 'object') throw new Error('invalid-ai-response')

  const { title, pitch, features } = parsed as Record<string, unknown>
  if (typeof title !== 'string' || typeof pitch !== 'string' || !Array.isArray(features)) {
    throw new Error('invalid-ai-response')
  }

  const cleanFeatures = features
    .filter((feature): feature is string => typeof feature === 'string')
    .map((feature) => feature.trim())
    .filter(Boolean)
    .slice(0, 6)

  if (!title.trim() || !pitch.trim() || cleanFeatures.length < 3) {
    throw new Error('invalid-ai-response')
  }

  return { title: title.trim(), pitch: pitch.trim(), features: cleanFeatures }
}

async function requestBrief(
  model: string,
  typeLabel: string,
  themeLabel: string,
): Promise<GeneratedBrief> {
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
          contents: [
            { role: 'user', parts: [{ text: buildPrompt(typeLabel, themeLabel) }] },
          ],
          generationConfig: {
            temperature: 1.1,
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

    return parseBrief(text)
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function generateAIIdea(): Promise<Idea> {
  if (!API_KEY) throw new Error('missing-ai-api-key')

  const type = pickRandom(PROJECT_TYPES)
  const theme = pickRandom(THEMES)

  let lastError: unknown

  for (const model of MODELS) {
    try {
      const brief = await requestBrief(model, type.label, theme.label)
      const seed = createSeed()

      return {
        id: ideaCode(seed),
        seed,
        type,
        theme,
        title: brief.title,
        pitch: brief.pitch,
        features: brief.features,
        difficulty: type.difficulty,
        source: 'ai',
      }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('ai-unavailable')
}
