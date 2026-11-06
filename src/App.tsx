import { useCallback, useEffect, useRef, useState } from 'react'
import { Footer } from './components/Footer'
import { Generator } from './components/Generator'
import { Hero } from './components/Hero'
import { History } from './components/History'
import { HowItWorks } from './components/HowItWorks'
import { Nav } from './components/Nav'
import { Ticker } from './components/Ticker'
import { useHistory } from './hooks/useHistory'
import { useRateLimit } from './hooks/useRateLimit'
import { useI18n } from './i18n'
import { generateAIIdea, MissingKeyError, RateLimitError, translateIdea } from './lib/ai'
import type { GeneratorError, Idea, Language } from './types'

const ROLL_DURATION = 760

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export default function App() {
  const { language, messages } = useI18n()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<GeneratorError | ''>('')
  const { entries, add, update, clear } = useHistory()
  const { snapshot, check, consume, refund } = useRateLimit()
  const request = useRef(0)
  const languageRef = useRef(language)
  const activeTranslations = useRef(new Set<string>())

  useEffect(() => {
    languageRef.current = language
  }, [language])

  const translateCurrent = useCallback(
    async (source: Idea, target: Language) => {
      if (source.language === target) return

      const key = `${source.seed}:${target}`
      if (activeTranslations.current.has(key)) return

      activeTranslations.current.add(key)
      setIsTranslating(true)

      try {
        const translated = await translateIdea(source, target)
        if (languageRef.current !== target) return
        setIdea((current) => (current?.seed === source.seed ? translated : current))
        update(translated)
      } catch (translationError) {
        console.warn('Could not translate the idea.', translationError)
      } finally {
        activeTranslations.current.delete(key)
        if (activeTranslations.current.size === 0) setIsTranslating(false)
      }
    },
    [update],
  )

  useEffect(() => {
    if (!idea || idea.language === language) return
    const timer = window.setTimeout(() => void translateCurrent(idea, language), 0)
    return () => window.clearTimeout(timer)
  }, [idea, language, translateCurrent])

  const generate = useCallback(() => {
    if (isRolling) return

    const gate = check()
    if (!gate.allowed) {
      setError(gate.reason === 'day' ? 'day' : 'rate')
      return
    }

    const requestId = ++request.current
    const reserved = consume()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const avoid = entries.map(({ idea: previous }) => ({
      type: previous.type,
      theme: previous.theme,
      title: previous.title,
    }))

    setIsRolling(true)
    setError('')

    const run = async () => {
      const startedAt = Date.now()
      let next: Idea

      try {
        next = await generateAIIdea({ language, avoid })
      } catch (generationError) {
        console.warn('Could not generate the idea with AI.', generationError)
        if (requestId !== request.current) return
        if (!(generationError instanceof RateLimitError)) refund(reserved)
        setError(
          generationError instanceof RateLimitError
            ? 'rate'
            : generationError instanceof MissingKeyError
              ? 'missingKey'
              : 'generic',
        )
        setIsRolling(false)
        return
      }

      if (!reducedMotion) {
        const remaining = ROLL_DURATION - (Date.now() - startedAt)
        if (remaining > 0) await wait(remaining)
      }

      if (requestId !== request.current) return

      setIdea(next)
      add(next)
      setIsRolling(false)
    }

    void run()
  }, [add, check, consume, entries, isRolling, language, refund])

  const visibleError: GeneratorError | '' =
    (error === 'rate' || error === 'day') && snapshot.allowed ? '' : error

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'g' || event.repeat) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return

      event.preventDefault()
      generate()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [generate])

  const openFromHistory = useCallback((next: Idea) => {
    request.current += 1
    setError('')
    setIsRolling(false)
    setIdea(next)
    document.getElementById('generador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const generateFromFooter = () => {
    generate()
    document.getElementById('generador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app">
      <a className="skip-link" href="#generador">
        {messages.nav.skip}
      </a>

      <Nav />

      <main>
        <Hero onGenerate={generate} />

        <div className="ticker-block">
          <Ticker />
        </div>

        <Generator
          idea={idea}
          error={visibleError}
          isRolling={isRolling}
          isTranslating={isTranslating}
          onGenerate={generate}
          cooldownSeconds={snapshot.cooldownSeconds}
          minuteLimit={snapshot.minuteLimit}
          dayLimit={snapshot.dayLimit}
        />
        <History entries={entries} onOpen={openFromHistory} onClear={clear} />
        <HowItWorks />
      </main>

      <Footer onGenerate={generateFromFooter} />
    </div>
  )
}
