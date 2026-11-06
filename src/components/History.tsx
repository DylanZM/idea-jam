import { useEffect, useState } from 'react'
import { timeAgo } from '../lib/format'
import type { HistoryEntry, Idea } from '../types'
import { ArrowUpRight, Trash } from './Icons'

type HistoryProps = {
  entries: HistoryEntry[]
  onOpen: (idea: Idea) => void
  onClear: () => void
}

export function History({ entries, onOpen, onClear }: HistoryProps) {
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const timeout = window.setTimeout(() => setConfirming(false), 3200)
    return () => window.clearTimeout(timeout)
  }, [confirming])

  const ideas = entries

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
            <span className="eyebrow">03 / TU ARCHIVO</span>
            <h2>
              Historial.
              <span className="history-count">{entries.length}/10</span>
            </h2>
          </div>
          <div className="history-head-right">
            <p>
              Tus últimas diez ideas quedan guardadas en este navegador. Sin cuenta, sin nube,
              sin excusas para no volver.
            </p>
            <button
              className={`btn btn-sm${confirming ? ' btn-coral' : ' btn-paper'}`}
              type="button"
              onClick={handleClear}
              disabled={entries.length === 0}
            >
              <Trash className="icon" />
              {confirming ? '¿SEGURO?' : 'VACIAR'}
            </button>
          </div>
        </div>

        {ideas.length === 0 ? (
          <div className="history-empty">
            <piix-sprite name="gloop" size="88" />
            <div>
              <h3>El historial está en blanco.</h3>
              <p>Genera la primera idea y aparecerá aquí, lista para volver a abrirla.</p>
            </div>
            <a className="btn btn-orange" href="#generador">
              IR AL GENERADOR
              <ArrowUpRight className="icon" />
            </a>
          </div>
        ) : (
          <div className="history-grid">
            {ideas.map(({ idea, createdAt }, index) => (
              <button
                className={`history-card card-${idea.accent}`}
                type="button"
                key={idea.seed}
                onClick={() => onOpen(idea)}
                aria-label={`Abrir idea ${idea.title}`}
              >
                <div className="history-card-top">
                  <span className="history-number">
                    {String(ideas.length - index).padStart(2, '0')}
                  </span>
                  <span className="history-time">{timeAgo(createdAt)}</span>
                  <ArrowUpRight className="history-arrow icon" />
                </div>
                <span className={`tag tag-${idea.accent}`}>{idea.type}</span>
                <h3>{idea.title}</h3>
                <p>{idea.theme}</p>
                <span className="history-open">ABRIR IDEA</span>
              </button>
            ))}
          </div>
        )}

        <p className="history-note">
          Guardado solo en tu navegador con localStorage. Si borras los datos del sitio, se va.
        </p>
      </div>
    </section>
  )
}
