import type { Idea } from '../types'
import { IdeaTicket } from './IdeaTicket'
import { Sparkle, Terminal } from './Icons'

type GeneratorProps = {
  idea: Idea | null
  error: string
  isRolling: boolean
  onGenerate: () => void
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

export function Generator({ idea, error, isRolling, onGenerate }: GeneratorProps) {
  return (
    <section className="section generator-section" id="generador">
      <div className="container">
        <div className="section-head generator-head">
          <div>
            <span className="eyebrow">02 / EL GENERADOR</span>
            <h2>
              Tira.
              <br />
              <em>Mezcla.</em>
              <br />
              Publica.
            </h2>
          </div>
          <div className="generator-intro">
            <p>
              La IA decide el formato, el nicho y escribe el brief completo. El resultado no es
              una idea perfecta: es una idea que puedes empezar hoy.
            </p>
            <span className="generator-tag">
              <Sparkle className="icon" />
              SIN PLANTILLAS / SIN EXCUSAS
            </span>
          </div>
        </div>

        <div className="machine">
          <div className="machine-top">
            <span className="machine-name">
              <Terminal className="icon" />
              GENERADOR / 01
            </span>
            <span className={`status-pill${isRolling ? ' is-busy' : ''}`}>
              <span className="status-dot" aria-hidden />
              {isRolling ? 'GENERANDO' : idea ? 'IA' : 'ESPERANDO'}
            </span>
          </div>

          <div className="reels" aria-busy={isRolling}>
            <Slot
              index="01"
              label="FORMATO"
              value={isRolling ? 'GENERANDO…' : idea?.type ?? '— — —'}
              accent="lime"
              rolling={isRolling}
            />
            <Slot
              index="02"
              label="NICHO"
              value={isRolling ? 'GENERANDO…' : idea?.theme ?? '— — —'}
              accent="coral"
              rolling={isRolling}
            />
          </div>

          <div className="machine-controls">
            <button
              className="btn btn-orange btn-xl generate-btn js-generate"
              type="button"
              onClick={onGenerate}
              disabled={isRolling}
            >
              <Sparkle className={`icon${isRolling ? ' spin' : ''}`} />
              <span>{isRolling ? 'GENERANDO…' : 'GENERAR IDEA'}</span>
              <span className="btn-key">{isRolling ? '···' : 'G'}</span>
            </button>
            {error ? (
              <p className="machine-error" role="alert">
                {error}
              </p>
            ) : (
              <p className="machine-note">
                Un clic. Una idea. Si no te convence, vuelve a tirar.
              </p>
            )}
          </div>

          <piix-pal pal="pip" on=".js-generate" scale="3" />
        </div>

        <IdeaTicket idea={idea} isRolling={isRolling} key={idea?.seed ?? 'empty'} />
      </div>
    </section>
  )
}
