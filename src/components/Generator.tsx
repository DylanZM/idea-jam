import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import type { GeneratorError, Idea } from '../types'
import { IdeaTicket } from './IdeaTicket'
import { Sparkle, Terminal } from './Icons'

type GeneratorProps = {
  idea: Idea | null
  error: GeneratorError | ''
  isRolling: boolean
  isTranslating: boolean
  onGenerate: () => void
  cooldownSeconds: number
  minuteLimit: number
  dayLimit: number
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

export function Generator({
  idea,
  error,
  isRolling,
  isTranslating,
  onGenerate,
  cooldownSeconds,
  minuteLimit,
  dayLimit,
}: GeneratorProps) {
  const { messages } = useI18n()
  const [thought, setThought] = useState(0)
  const thinking = messages.generator.thinking

  useEffect(() => {
    if (!isRolling) return
    const tick = window.setInterval(() => {
      setThought((current) => (current + 1) % thinking.length)
    }, 1_400)
    return () => window.clearInterval(tick)
  }, [isRolling, thinking.length])

  const coolingDown = cooldownSeconds > 0
  const buttonLabel = isRolling
    ? messages.generator.generating
    : coolingDown
      ? messages.generator.cooldown.replace('{seconds}', String(cooldownSeconds))
      : messages.generator.generate

  const rateNote = messages.generator.rateNote
    .replace('{minute}', String(minuteLimit))
    .replace('{day}', String(dayLimit))

  return (
    <section className="section generator-section" id="generador">
      <div className="container">
        <div className="section-head generator-head">
          <div>
            <span className="eyebrow">{messages.generator.eyebrow}</span>
            <h2>
              {messages.generator.title1}
              <br />
              <em>{messages.generator.title2}</em>
              <br />
              {messages.generator.title3}
            </h2>
          </div>
          <div className="generator-intro">
            <p>{messages.generator.intro}</p>
            <span className="generator-tag">
              <Sparkle className="icon" />
              {messages.generator.tag}
            </span>
          </div>
        </div>

        <div className="machine">
          <div className="machine-top">
            <span className="machine-name">
              <Terminal className="icon" />
              {messages.generator.machineName}
            </span>
            <span className={`status-pill${isRolling ? ' is-busy' : ''}`}>
              <span className="status-dot" aria-hidden />
              {isRolling
                ? messages.generator.statusBusy
                : isTranslating
                  ? messages.generator.statusTranslating
                  : idea
                    ? messages.generator.statusReady
                    : messages.generator.statusIdle}
            </span>
          </div>

          <div className="reels" aria-busy={isRolling}>
            <Slot
              index="01"
              label={messages.generator.format}
              value={isRolling ? messages.generator.generating : idea?.type ?? messages.generator.placeholder}
              accent="lime"
              rolling={isRolling}
            />
            <Slot
              index="02"
              label={messages.generator.niche}
              value={isRolling ? messages.generator.generating : idea?.theme ?? messages.generator.placeholder}
              accent="coral"
              rolling={isRolling}
            />
          </div>

          {isRolling ? (
            <div className="machine-thinking" aria-live="polite">
              <span className="thinking-dot" aria-hidden />
              {thinking[thought]}
              <span className="thinking-ellipsis" aria-hidden>
                …
              </span>
            </div>
          ) : null}

          <div className="machine-controls">
            <button
              className="btn btn-orange btn-xl generate-btn js-generate"
              type="button"
              onClick={onGenerate}
              disabled={isRolling || coolingDown}
            >
              <Sparkle className={`icon${isRolling ? ' spin' : ''}`} />
              <span>{buttonLabel}</span>
              <span className="btn-key">{isRolling ? '···' : coolingDown ? cooldownSeconds : 'G'}</span>
            </button>

            <div className="machine-status">
              {error ? (
                <p className="machine-error" role="alert">
                  {messages.generator.errors[error]}
                </p>
              ) : coolingDown ? (
                <p className="machine-note">
                  {messages.generator.cooldown.replace('{seconds}', String(cooldownSeconds))}
                </p>
              ) : (
                <p className="machine-note">{messages.generator.note}</p>
              )}
              <p className="machine-rate">{rateNote}</p>
            </div>
          </div>

          <piix-pal pal="pip" on=".js-generate" scale="3" />
        </div>

        <IdeaTicket
          idea={idea}
          isRolling={isRolling}
          isTranslating={isTranslating}
          key={idea?.seed ?? 'empty'}
        />
      </div>
    </section>
  )
}
