import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { timeAgo } from '../lib/format'
import { HISTORY_LIMIT } from '../lib/storage'
import type { HistoryEntry, Idea } from '../types'
import { ArrowUpRight, Trash } from './Icons'

type HistoryProps = {
  entries: HistoryEntry[]
  onOpen: (idea: Idea) => void
  onClear: () => void
}

export function History({ entries, onOpen, onClear }: HistoryProps) {
  const { language, messages } = useI18n()
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const timeout = window.setTimeout(() => setConfirming(false), 3200)
    return () => window.clearTimeout(timeout)
  }, [confirming])

  const handleClear = () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    onClear()
    setConfirming(false)
  }

  return (
    <section className="section history-section" id="historial">
      <div className="container">
        <div className="section-head history-head">
          <div>
            <span className="eyebrow">{messages.history.eyebrow}</span>
            <h2>
              {messages.history.title}
              <span className="history-count">
                {entries.length}/{HISTORY_LIMIT}
              </span>
            </h2>
          </div>
          <div className="history-head-right">
            <p>{messages.history.intro}</p>
            <button
              className={`btn btn-sm${confirming ? ' btn-coral' : ' btn-paper'}`}
              type="button"
              onClick={handleClear}
              disabled={entries.length === 0}
            >
              <Trash className="icon" />
              {confirming ? messages.history.confirm : messages.history.clear}
            </button>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="history-empty">
            <piix-sprite name="gloop" size="88" />
            <div>
              <h3>{messages.history.emptyTitle}</h3>
              <p>{messages.history.emptyText}</p>
            </div>
            <a className="btn btn-orange" href="#generador">
              {messages.history.goToGenerator}
              <ArrowUpRight className="icon" />
            </a>
          </div>
        ) : (
          <div className="history-grid">
            {entries.map(({ idea, createdAt }, index) => (
              <button
                className={`history-card card-${idea.accent}`}
                type="button"
                key={idea.seed}
                onClick={() => onOpen(idea)}
                aria-label={messages.history.openAria.replace('{title}', idea.title)}
              >
                <div className="history-card-top">
                  <span className="history-number">
                    {String(entries.length - index).padStart(2, '0')}
                  </span>
                  <span className="history-time">{timeAgo(createdAt, language)}</span>
                  <ArrowUpRight className="history-arrow icon" />
                </div>
                <span className={`tag tag-${idea.accent}`}>{idea.type}</span>
                <h3>{idea.title}</h3>
                <p>{idea.theme}</p>
                <span className="history-open">{messages.history.open}</span>
              </button>
            ))}
          </div>
        )}

        <p className="history-note">{messages.history.note}</p>
      </div>
    </section>
  )
}
