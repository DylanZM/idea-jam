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
import { generateAIIdea, MissingKeyError, RateLimitError } from './lib/ai'
import type { GeneratorError, Idea } from './types'

const ROLL_DURATION = 760

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export default function App() {
  const { language, messages } = useI18n()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [isRolling, setIsRolling] = useState(false)
  const [error, setError] = useState<GeneratorError | ''>('')
  const { entries, add, clear } = useHistory()
  const { snapshot, check, consume, refund } = useRateLimit()
  const request = useRef(0)

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
        console.warn('No se pudo generar la idea con IA.', generationError)
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
        <Hero idea={idea} isRolling={isRolling} onGenerate={generate} />

        <div className="divider-band divider-to-blue" aria-hidden>
          <piix-divider kind="wave" from="#ecebe6" to="#1f3cff" />
        </div>

        <Ticker />

        <div className="divider-band divider-from-blue" aria-hidden>
          <piix-divider kind="wave" from="#1f3cff" to="#ecebe6" />
        </div>

        <Generator
          idea={idea}
          error={visibleError}
          isRolling={isRolling}
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
