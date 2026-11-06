import { useEffect, useRef, useState } from 'react'
import { difficultyLabel } from '../lib/generator'
import type { Idea } from '../types'
import { Check, Copy } from './Icons'

type IdeaTicketProps = {
  idea: Idea | null
  isRolling: boolean
}

type CopyState = 'idle' | 'copied' | 'error'

function buildBrief(idea: Idea): string {
  return [
    `IDEA JAM #${idea.id}`,
    '',
    idea.title,
    '',
    idea.description,
    '',
    `FORMATO: ${idea.type}`,
    `NICHO: ${idea.theme}`,
    `DIFICULTAD: ${difficultyLabel(idea.difficulty)}`,
    '',
    'LO QUE TIENE QUE TENER',
    ...idea.features.map((feature) => `- ${feature}`),
  ].join('\n')
}

export function IdeaTicket({ idea, isRolling }: IdeaTicketProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current)
    }
  }, [])

  if (!idea) {
    return (
      <article className="ticket ticket-empty" id="idea-result">
        <div className="ticket-perf" aria-hidden />
        <header className="ticket-head">
          <span className="ticket-code">IDEA —</span>
          <span className="ticket-stamp" aria-hidden>
            BRIEF
          </span>
        </header>
        <div className="ticket-main">
          <div className="ticket-title-wrap">
            <span className="ticket-kicker">PROPUESTA / IA</span>
            <h3>Tu próxima idea empieza aquí</h3>
            <p className="ticket-pitch">
              Pulsa generar y la IA escribirá el formato, el nicho, una descripción clara y lo
              que el proyecto tiene que tener.
            </p>
          </div>
        </div>
        <piix-pal pal="kitty" scale="3" at="0.92" />
      </article>
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildBrief(idea))
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    if (timeout.current) window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => setCopyState('idle'), 2200)
  }

  return (
    <article
      className={`ticket${isRolling ? ' ticket-busy' : ''}`}
      id="idea-result"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="ticket-perf" aria-hidden />

      <header className="ticket-head">
        <span className="ticket-code">IDEA #{idea.id}</span>
        <span className={`tag tag-${idea.accent}`}>{idea.type}</span>
        <span className="ticket-stamp" aria-hidden>
          BRIEF
        </span>
      </header>

      <div className="ticket-main">
        <div className="ticket-title-wrap">
          <span className="ticket-kicker">PROPUESTA / {idea.theme.toUpperCase()}</span>
          <h3>{idea.title}</h3>
          <p className="ticket-pitch">{idea.description}</p>
        </div>

        <div className="ticket-flap" aria-hidden>
          <piix-flap key={idea.id} text={`IDEA ${idea.id}`} length={9} />
          <span className="ticket-flap-label">SPLIT-FLAP / IDEA ID</span>
        </div>
      </div>

      <dl className="ticket-meta">
        <div>
          <dt>Nicho</dt>
          <dd>{idea.theme}</dd>
        </div>
        <div>
          <dt>Nivel</dt>
          <dd>{difficultyLabel(idea.difficulty)}</dd>
        </div>
      </dl>

      <div className="ticket-features">
        <h4>Lo que tiene que tener</h4>
        <ul>
          {idea.features.map((feature) => (
            <li key={feature}>
              <span className="feature-box" aria-hidden>
                <Check className="feature-check" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <footer className="ticket-foot">
        <span className="ticket-seed">SEED {idea.seed.toString(16).toUpperCase()}</span>
        <span className="ticket-barcode" aria-hidden>
          {Array.from({ length: 22 }, (_, index) => (
            <i key={index} />
          ))}
        </span>
        <button className="btn btn-ink btn-sm" type="button" onClick={handleCopy}>
          {copyState === 'copied' ? (
            <>
              <Check className="icon" />
              COPIADO
            </>
          ) : copyState === 'error' ? (
            'NO SE PUDO'
          ) : (
            <>
              <Copy className="icon" />
              COPIAR BRIEF
            </>
          )}
        </button>
      </footer>

      <piix-pal pal="kitty" scale="3" at="0.92" />
    </article>
  )
}
