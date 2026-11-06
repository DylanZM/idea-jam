import { difficultyLabel } from '../lib/generator'
import type { Idea } from '../types'
import { ArrowDown, ArrowRight, Sparkle } from './Icons'

type HeroProps = {
  idea: Idea | null
  isRolling: boolean
  onGenerate: () => void
}

export function Hero({ idea, isRolling, onGenerate }: HeroProps) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden />
      <span className="hero-rail" aria-hidden>
        GENERADOR DE TÓPICOS / RANDOM / 2026
      </span>

      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="kicker">
            <span className="kicker-index">01</span>
            MÁQUINA DE TÓPICOS
            <span className="kicker-status">ONLINE</span>
          </div>

          <h1 className="hero-title">
            No sabes
            <br />
            qué
            <br />
            <mark>construir.</mark>
          </h1>

          <p className="hero-sub">
            La IA elige un formato y un nicho, y escribe el brief completo con una descripción
            clara y lo que el proyecto tiene que tener. La excusa perfecta para empezar hoy.
          </p>

          <div className="hero-actions">
            <a className="btn btn-orange btn-lg" href="#generador" onClick={onGenerate}>
              GENERAR IDEA
              <ArrowDown className="icon" />
            </a>
            <a className="btn btn-outline btn-lg" href="#historial">
              VER HISTORIAL
              <ArrowRight className="icon" />
            </a>
          </div>

          <p className="hero-hint">
            <kbd>G</kbd> PARA OTRA TIRADA <span className="hint-slash">/</span> IDEAS SIN
            PLANTILLAS
          </p>

          <dl className="hero-stats">
            <div>
              <dt>Generación</dt>
              <dd>IA</dd>
            </div>
            <div>
              <dt>Plantillas</dt>
              <dd>0</dd>
            </div>
          </dl>
        </div>

        <div className="brief-wrap">
          <article className={`brief${isRolling ? ' brief-busy' : ''}`}>
            <header className="brief-top">
              <span>PROJECT BRIEF</span>
              <span>Nº {idea?.id ?? '—'}</span>
            </header>

            <div className="brief-type">
              <span className="brief-type-label">FORMATO</span>
              <strong>{isRolling || !idea ? '— — —' : idea.type}</strong>
            </div>

            <dl className="brief-fields">
              <div>
                <dt>NICHO</dt>
                <dd>{isRolling || !idea ? '...' : idea.theme}</dd>
              </div>
              <div>
                <dt>NIVEL</dt>
                <dd>{isRolling || !idea ? '...' : difficultyLabel(idea.difficulty)}</dd>
              </div>
            </dl>

            <footer className="brief-foot">
              <span className="brief-barcode" aria-hidden>
                {Array.from({ length: 28 }, (_, index) => (
                  <i key={index} />
                ))}
              </span>
              <span className="brief-seed">
                SEED {idea ? idea.seed.toString(16).toUpperCase() : '—'}
              </span>
            </footer>

            <span className="brief-stamp" aria-hidden>
              NO HAY EXCUSAS
            </span>
            <span className="brief-sticker" aria-hidden>
              <Sparkle className="icon" />
              IA
            </span>

            <piix-sprite name="mochi" size="76" className="brief-sprite" />
          </article>
        </div>
      </div>
    </section>
  )
}
