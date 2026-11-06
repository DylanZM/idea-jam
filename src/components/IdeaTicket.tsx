import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import type { Messages } from '../i18n'
import type { Idea } from '../types'
import { Check, Copy } from './Icons'

type IdeaTicketProps = {
  idea: Idea | null
  isRolling: boolean
  isTranslating: boolean
}

type CopyState = 'idle' | 'copied' | 'error'

function buildBrief(idea: Idea, messages: Messages): string {
  return [
    `IDEA JAM #${idea.id}`,
    '',
    idea.title,
    '',
    idea.description,
    '',
    `${messages.generator.format}: ${idea.type}`,
    `${messages.ticket.metaNiche.toUpperCase()}: ${idea.theme}`,
    `${messages.ticket.metaLevel.toUpperCase()}: ${messages.difficulty[idea.difficulty]}`,
    '',
    messages.ticket.featuresHeading.toUpperCase(),
    ...idea.features.map((feature) => `- ${feature}`),
  ].join('\n')
}

export function IdeaTicket({ idea, isRolling, isTranslating }: IdeaTicketProps) {
  const { messages } = useI18n()
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const timeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) window.clearTimeout(timeout.current)
    }
  }, [])

  if (!idea && isRolling) {
    return (
      <article className="ticket ticket-loading" id="idea-result" aria-live="polite" aria-busy>
        <div className="ticket-perf" aria-hidden />
        <header className="ticket-head">
          <span className="ticket-code">{messages.ticket.code} —</span>
          <span className="ticket-stamp" aria-hidden>
            {messages.ticket.brief}
          </span>
        </header>
        <div className="ticket-main">
          <div className="ticket-title-wrap">
            <span className="ticket-kicker">{messages.ticket.loadingKicker}</span>
            <h3>{messages.ticket.loadingTitle}</h3>
            <p className="ticket-pitch">{messages.ticket.loadingText}</p>
            <div className="ticket-skeleton" aria-hidden>
              <span className="skeleton-line" />
              <span className="skeleton-line" />
              <span className="skeleton-line skeleton-line-short" />
            </div>
          </div>
          <div className="ticket-flap ticket-flap-ghost" aria-hidden />
        </div>
      </article>
    )
  }

  if (!idea) {
    return (
      <article className="ticket ticket-empty" id="idea-result">
        <div className="ticket-perf" aria-hidden />
        <header className="ticket-head">
          <span className="ticket-code">
            {messages.ticket.code} —
          </span>
          <span className="ticket-stamp" aria-hidden>
            {messages.ticket.brief}
          </span>
        </header>
        <div className="ticket-main">
          <div className="ticket-title-wrap">
            <span className="ticket-kicker">{messages.ticket.emptyKicker}</span>
            <h3>{messages.ticket.emptyTitle}</h3>
            <p className="ticket-pitch">{messages.ticket.emptyText}</p>
          </div>
        </div>
        <piix-pal pal="kitty" scale="3" at="0.92" />
      </article>
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildBrief(idea, messages))
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    if (timeout.current) window.clearTimeout(timeout.current)
    timeout.current = window.setTimeout(() => setCopyState('idle'), 2200)
  }

  return (
    <article
      className={`ticket${isRolling ? ' ticket-busy' : ''}${isTranslating ? ' ticket-translating' : ''}`}
      id="idea-result"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={isRolling || isTranslating}
    >
      <div className="ticket-perf" aria-hidden />

      <header className="ticket-head">
        <span className="ticket-code">
          {messages.ticket.code} #{idea.id}
        </span>
        <span className={`tag tag-${idea.accent}`}>{idea.type}</span>
        <span className="ticket-stamp" aria-hidden>
          {messages.ticket.brief}
        </span>
      </header>

      <div className="ticket-main">
        <div className="ticket-title-wrap">
          <span className="ticket-kicker">
            {messages.ticket.proposal} / {idea.theme.toUpperCase()}
          </span>
          <h3>{idea.title}</h3>
          <p className="ticket-pitch">{idea.description}</p>
        </div>

        <div className="ticket-flap" aria-hidden>
          <piix-flap key={idea.id} text={`${messages.ticket.code} ${idea.id}`} length={9} />
          <span className="ticket-flap-label">SPLIT-FLAP / IDEA ID</span>
        </div>
      </div>

      {isTranslating ? (
        <p className="ticket-translate-note" role="status">
          <span className="thinking-dot" aria-hidden />
          {messages.ticket.translating}
        </p>
      ) : null}

      <dl className="ticket-meta">
        <div>
          <dt>{messages.ticket.metaNiche}</dt>
          <dd>{idea.theme}</dd>
        </div>
        <div>
          <dt>{messages.ticket.metaLevel}</dt>
          <dd>{messages.difficulty[idea.difficulty]}</dd>
        </div>
      </dl>

      <div className="ticket-features">
        <h4>{messages.ticket.featuresHeading}</h4>
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
        <span className="ticket-seed">
          {messages.ticket.seed} {idea.seed.toString(16).toUpperCase()}
        </span>
        <span className="ticket-barcode" aria-hidden>
          {Array.from({ length: 22 }, (_, index) => (
            <i key={index} />
          ))}
        </span>
        <button className="btn btn-ink btn-sm" type="button" onClick={handleCopy}>
          {copyState === 'copied' ? (
            <>
              <Check className="icon" />
              {messages.ticket.copied}
            </>
          ) : copyState === 'error' ? (
            messages.ticket.copyError
          ) : (
            <>
              <Copy className="icon" />
              {messages.ticket.copy}
            </>
          )}
        </button>
      </footer>

      <piix-pal pal="kitty" scale="3" at="0.92" />
    </article>
  )
}
