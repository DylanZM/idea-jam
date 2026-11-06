import { useCallback, useEffect, useRef, useState } from 'react'
import { Footer } from './components/Footer'
import { Generator } from './components/Generator'
import { Hero } from './components/Hero'
import { History } from './components/History'
import { HowItWorks } from './components/HowItWorks'
import { Nav } from './components/Nav'
import { Ticker } from './components/Ticker'
import { useHistory } from './hooks/useHistory'
import { createSeed, generateIdea } from './lib/generator'
import type { Idea } from './types'

const ROLL_DURATION = 760

export default function App() {
  const [idea, setIdea] = useState<Idea>(() => generateIdea(createSeed()))
  const [isRolling, setIsRolling] = useState(false)
  const { entries, add, clear } = useHistory()
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current)
    }
  }, [])

  const generate = useCallback(() => {
    if (isRolling) return

    const seed = createSeed()
    const next = generateIdea(seed)

    const finish = () => {
      setIdea(next)
      add(next)
      setIsRolling(false)
      timeout.current = null
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      finish()
      return
    }

    setIsRolling(true)
    timeout.current = window.setTimeout(finish, ROLL_DURATION)
  }, [add, isRolling])

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

  const openFromHistory = useCallback((idea: Idea) => {
    if (timeout.current) {
      window.clearTimeout(timeout.current)
      timeout.current = null
    }
    setIsRolling(false)
    setIdea(idea)
    document.getElementById('generador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const generateFromFooter = () => {
    generate()
    document.getElementById('generador')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="app">
      <a className="skip-link" href="#generador">
        Saltar al generador
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

        <Generator idea={idea} isRolling={isRolling} onGenerate={generate} />
        <History entries={entries} onOpen={openFromHistory} onClear={clear} />
        <HowItWorks />
      </main>

      <Footer onGenerate={generateFromFooter} />
    </div>
  )
}
