import { useRef, useState } from 'react'
import { difficultyLabel } from '../lib/generator'
import type { Idea } from '../types'
import { Check, Copy } from './Icons'

type IdeaTicketProps = {
  idea: Idea
  isRolling: boolean
}

type CopyState = 'idle' | 'copied' | 'error'

function buildBrief(idea: Idea): string {
  return [
    `IDEA JAM #${idea.id}`,
    '',
    idea.title,
    '',
    idea.pitch,
    '',
    `TIPO: ${idea.type.label}`,
    `TEMA: ${idea.theme.label}`,
    `TWIST: ${idea.twist.label}`,
    `STACK: ${idea.stack.label} (${idea.stack.detail})`,
    `DIFICULTAD: ${difficultyLabel(idea.difficulty)}`,
    '',
    'QUÉ TIENE QUE TENER',
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
        <span className={`tag tag-${idea.type.color}`}>{idea.type.label}</span>
        <span className="ticket-stamp" aria-hidden>
          BRIEF
        </span>
      </header>

      <div className="ticket-main">
        <div className="ticket-title-wrap">
          <span className="ticket-kicker">PROPUESTA / {idea.theme.id.toUpperCase()}</span>
          <h3>{idea.title}</h3>
          <p className="ticket-pitch">{idea.pitch}</p>
        </div>

        <div className="ticket-flap" aria-hidden>
          <piix-flap key={idea.id} text={`IDEA ${idea.id}`} length={9} />
          <span className="ticket-flap-label">SPLIT-FLAP / IDEA ID</span>
        </div>
      </div>

      <dl className="ticket-meta">
        <div>
          <dt>Tema</dt>
          <dd>{idea.theme.label}</dd>
        </div>
        <div>
          <dt>Twist</dt>
          <dd>{idea.twist.label}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{idea.stack.label}</dd>
        </div>
        <div>
          <dt>Nivel</dt>
          <dd>{difficultyLabel(idea.difficulty)}</dd>
        </div>
      </dl>

      <div className="ticket-features">
        <h4>Qué tiene que tener</h4>
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
