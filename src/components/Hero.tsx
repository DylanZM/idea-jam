import { PROJECT_TYPES, STACKS, THEMES, TWISTS } from '../data/ideas'
import { difficultyLabel } from '../lib/generator'
import type { Idea } from '../types'
import { ArrowDown, ArrowRight, Sparkle } from './Icons'

type HeroProps = {
  idea: Idea
  isRolling: boolean
  onGenerate: () => void
}

const combinations = PROJECT_TYPES.length * THEMES.length * TWISTS.length * STACKS.length
const combinationsLabel = new Intl.NumberFormat('es').format(combinations)

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
            Un formato, un nicho y una restricción al azar. La excusa perfecta para empezar tu
            próxima landing, SaaS o experimento antes de que se te ocurra otra cosa.
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
            <kbd>G</kbd> PARA OTRA TIRADA <span className="hint-slash">/</span>{' '}
            <strong>{combinationsLabel}</strong> COMBINACIONES
          </p>

          <dl className="hero-stats">
            <div>
              <dt>Formatos</dt>
              <dd>{PROJECT_TYPES.length}</dd>
            </div>
            <div>
              <dt>Nichos</dt>
              <dd>{THEMES.length}</dd>
            </div>
            <div>
              <dt>Twists</dt>
              <dd>{TWISTS.length}</dd>
            </div>
            <div>
              <dt>Stacks</dt>
              <dd>{STACKS.length}</dd>
            </div>
          </dl>
        </div>

        <div className="brief-wrap">
          <article className={`brief${isRolling ? ' brief-busy' : ''}`}>
            <header className="brief-top">
              <span>PROJECT BRIEF</span>
              <span>Nº {idea.id}</span>
            </header>

            <div className="brief-type">
              <span className="brief-type-label">FORMATO</span>
              <strong>{isRolling ? '— — —' : idea.type.slot}</strong>
            </div>

            <dl className="brief-fields">
              <div>
                <dt>TEMA</dt>
                <dd>{isRolling ? '...' : idea.theme.label}</dd>
              </div>
              <div>
                <dt>RESTRICCIÓN</dt>
                <dd>{isRolling ? '...' : idea.twist.label}</dd>
              </div>
              <div>
                <dt>STACK</dt>
                <dd>{isRolling ? '...' : idea.stack.label}</dd>
              </div>
              <div>
                <dt>NIVEL</dt>
                <dd>{isRolling ? '...' : difficultyLabel(idea.difficulty)}</dd>
              </div>
            </dl>

            <footer className="brief-foot">
              <span className="brief-barcode" aria-hidden>
                {Array.from({ length: 28 }, (_, index) => (
                  <i key={index} />
                ))}
              </span>
              <span className="brief-seed">SEED {idea.seed.toString(16).toUpperCase()}</span>
            </footer>

            <span className="brief-stamp" aria-hidden>
              NO HAY EXCUSAS
            </span>
            <span className="brief-sticker" aria-hidden>
              <Sparkle className="icon" />
              RANDOM
            </span>

            <piix-sprite name="mochi" size="76" className="brief-sprite" />
          </article>
        </div>
      </div>
    </section>
  )
}
