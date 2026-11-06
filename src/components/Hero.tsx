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
      <div className="hero-bg" aria-hidden>
        <span className="bg-block bg-block-lime" />
        <span className="bg-block bg-block-coral" />
        <span className="bg-block bg-block-violet" />
      </div>

      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="chip">
            <span className="chip-dot" aria-hidden />
            RANDOM PROJECT GENERATOR
            <span className="chip-version">V1.0</span>
          </div>

          <h1 className="hero-title">
            ¿Y si hoy construyes algo <mark>raro</mark>?
            <piix-pal pal="bitbug" scale="3" />
          </h1>

          <p className="hero-sub">
            Tópicos random para tu próxima landing, SaaS, juego o experimento. Un tipo, un tema
            y una restricción. Suficiente para dejar de mirar la pantalla en blanco.
          </p>

          <div className="hero-actions">
            <a className="btn btn-lime btn-lg" href="#generador" onClick={onGenerate}>
              GENERAR IDEA
              <ArrowDown className="icon" />
            </a>
            <a className="btn btn-paper btn-lg" href="#historial">
              VER HISTORIAL
              <ArrowRight className="icon" />
            </a>
          </div>

          <p className="hero-hint">
            <kbd>G</kbd> para generar otra · <span className="hint-strong">{combinationsLabel}</span>{' '}
            combinaciones posibles
          </p>

          <dl className="hero-stats">
            <div>
              <dt>Tipos</dt>
              <dd>{PROJECT_TYPES.length}</dd>
            </div>
            <div>
              <dt>Temas</dt>
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

        <div className="hero-console-wrap">
          <span className="sticker sticker-top" aria-hidden>
            <Sparkle className="icon" />
            NO HAY EXCUSAS
          </span>
          <span className="sticker sticker-bottom" aria-hidden>
            PIXEL POWERED
          </span>

          <div className={`console${isRolling ? ' console-busy' : ''}`}>
            <div className="console-bar">
              <span className="console-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <span className="console-name">idea.exe</span>
              <span className="console-status">{isRolling ? 'MEZCLANDO' : 'EN LÍNEA'}</span>
            </div>

            <div className="console-body">
              <p className="console-line">
                <span className="console-prompt">$</span> idea --random
              </p>
              <dl className="console-list">
                <div>
                  <dt>tipo</dt>
                  <dd>{isRolling ? '...' : idea.type.label}</dd>
                </div>
                <div>
                  <dt>tema</dt>
                  <dd>{isRolling ? '...' : idea.theme.label}</dd>
                </div>
                <div>
                  <dt>twist</dt>
                  <dd>{isRolling ? '...' : idea.twist.label}</dd>
                </div>
                <div>
                  <dt>stack</dt>
                  <dd>{isRolling ? '...' : idea.stack.label}</dd>
                </div>
                <div>
                  <dt>nivel</dt>
                  <dd>{isRolling ? '...' : difficultyLabel(idea.difficulty)}</dd>
                </div>
              </dl>
              <p className="console-cursor">
                <span className="console-prompt">$</span> listo para construir
                <span className="caret" aria-hidden />
              </p>
            </div>

            <div className="console-foot">
              <span>SEED #{idea.id}</span>
              <span>PIXXEL UI / 8-BIT</span>
            </div>

            <piix-pal pal="moss" scale="3" at="0.86" />
          </div>

          <piix-sprite name="gloop" size="92" className="hero-sprite hero-sprite-gloop" />
          <piix-sprite name="dice" size="68" className="hero-sprite hero-sprite-dice" />
          <piix-sprite name="star" size="46" className="hero-sprite hero-sprite-star" />
        </div>
      </div>
    </section>
  )
}
