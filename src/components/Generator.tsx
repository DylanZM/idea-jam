import { useEffect, useState } from 'react'
import { PROJECT_TYPES, THEMES, TWISTS } from '../data/ideas'
import type { Idea } from '../types'
import { IdeaTicket } from './IdeaTicket'
import { Sparkle, Terminal } from './Icons'

type GeneratorProps = {
  idea: Idea
  isRolling: boolean
  onGenerate: () => void
}

type Reel = {
  type: string
  theme: string
  twist: string
}

function randomReel(): Reel {
  const type = PROJECT_TYPES[Math.floor(Math.random() * PROJECT_TYPES.length)]
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)]
  const twist = TWISTS[Math.floor(Math.random() * TWISTS.length)]
  return { type: type.slot, theme: theme.label, twist: twist.label }
}

function Slot({
  index,
  label,
  value,
  accent,
  rolling,
}: {
  index: string
  label: string
  value: string
  accent: string
  rolling: boolean
}) {
  return (
    <div className={`slot slot-${accent}${rolling ? ' is-rolling' : ''}`}>
      <div className="slot-head">
        <span className="slot-index">{index}</span>
        <span className="slot-label">{label}</span>
      </div>
      <p className="slot-value" aria-hidden={rolling}>
        {value}
      </p>
      <span className="slot-corner" aria-hidden />
    </div>
  )
}

export function Generator({ idea, isRolling, onGenerate }: GeneratorProps) {
  const [reel, setReel] = useState<Reel>(() => ({
    type: idea.type.slot,
    theme: idea.theme.label,
    twist: idea.twist.label,
  }))

  useEffect(() => {
    if (!isRolling) return
    setReel(randomReel())
    const interval = window.setInterval(() => setReel(randomReel()), 80)
    return () => window.clearInterval(interval)
  }, [isRolling])

  return (
    <section className="section generator-section" id="generador">
      <div className="container">
        <div className="section-head generator-head">
          <div>
            <span className="eyebrow">// EL GENERADOR</span>
            <h2>
              Pulsa.
              <br />
              <em>Mezcla.</em>
              <br />
              Construye.
            </h2>
          </div>
          <div className="generator-intro">
            <p>
              Cada tirada combina un formato, un nicho y una restricción. No hay ideas buenas
              ni malas: hay ideas con o sin brief.
            </p>
            <span className="generator-tag">
              <Sparkle className="icon" />
              MODO CAOS ACTIVADO
            </span>
          </div>
        </div>

        <div className="machine">
          <div className="machine-top">
            <span className="machine-name">
              <Terminal className="icon" />
              IDEA MACHINE / 1.0
            </span>
            <span className={`status-pill${isRolling ? ' is-busy' : ''}`}>
              <span className="status-dot" aria-hidden />
              {isRolling ? 'GIRANDO' : 'LISTO'}
            </span>
          </div>

          <div className="reels" aria-busy={isRolling}>
            <Slot
              index="01"
              label="TIPO"
              value={isRolling ? reel.type : idea.type.slot}
              accent="lime"
              rolling={isRolling}
            />
            <Slot
              index="02"
              label="TEMA"
              value={isRolling ? reel.theme : idea.theme.label}
              accent="coral"
              rolling={isRolling}
            />
            <Slot
              index="03"
              label="TWIST"
              value={isRolling ? reel.twist : idea.twist.label}
              accent="violet"
              rolling={isRolling}
            />
          </div>

          <div className="machine-controls">
            <button
              className="btn btn-lime btn-xl generate-btn js-generate"
              type="button"
              onClick={onGenerate}
              disabled={isRolling}
            >
              <Sparkle className={`icon${isRolling ? ' spin' : ''}`} />
              <span>{isRolling ? 'MEZCLANDO…' : 'GENERAR IDEA'}</span>
              <span className="btn-key">{isRolling ? '···' : 'G'}</span>
            </button>
            <p className="machine-note">
              Un clic. Una idea. Si no te convence, vuelve a tirar.
            </p>
          </div>

          <piix-pal pal="pip" on=".js-generate" scale="3" />
        </div>

        <IdeaTicket idea={idea} isRolling={isRolling} />
      </div>
    </section>
  )
}
