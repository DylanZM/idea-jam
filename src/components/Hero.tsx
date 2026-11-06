import { useI18n } from '../i18n'
import type { Idea } from '../types'
import { ArrowDown, ArrowRight, Sparkle } from './Icons'

type HeroProps = {
  idea: Idea | null
  isRolling: boolean
  isTranslating: boolean
  onGenerate: () => void
}

export function Hero({ idea, isRolling, isTranslating, onGenerate }: HeroProps) {
  const { messages } = useI18n()
  const isBusy = isRolling || isTranslating
  const stateClass = isBusy ? ' brief-busy' : idea ? '' : ' brief-idle'

  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden />
      <span className="hero-rail" aria-hidden>
        {messages.hero.rail}
      </span>

      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="kicker">
            <span className="kicker-index">01</span>
            {messages.hero.kicker}
            <span className="kicker-status">{messages.hero.status}</span>
          </div>

          <h1 className="hero-title">
            {messages.hero.title1}
            <br />
            {messages.hero.title2}
            <br />
            <mark>{messages.hero.title3}</mark>
          </h1>

          <p className="hero-sub">{messages.hero.sub}</p>

          <div className="hero-actions">
            <a className="btn btn-orange btn-lg" href="#generador" onClick={onGenerate}>
              {messages.hero.generate}
              <ArrowDown className="icon" />
            </a>
            <a className="btn btn-outline btn-lg" href="#historial">
              {messages.hero.history}
              <ArrowRight className="icon" />
            </a>
          </div>

          <p className="hero-hint">
            <kbd>G</kbd> {messages.hero.hintBefore}{' '}
            <span className="hint-slash">{messages.hero.hintSlash}</span>{' '}
            {messages.hero.hintAfter}
          </p>

          <dl className="hero-stats">
            <div>
              <dt>{messages.hero.statGeneration}</dt>
              <dd>{messages.hero.statGenerationValue}</dd>
            </div>
            <div>
              <dt>{messages.hero.statTemplates}</dt>
              <dd>{messages.hero.statTemplatesValue}</dd>
            </div>
          </dl>
        </div>

        <div className="brief-wrap">
          <article className={`brief${stateClass}`}>
            <header className="brief-top">
              <span>{messages.hero.briefTop}</span>
              <span>
                {messages.hero.briefNo} {idea?.id ?? '—'}
              </span>
            </header>

            <div className="brief-type">
              <span className="brief-type-label">{messages.hero.briefFormat}</span>
              <strong>
                {isRolling
                  ? messages.hero.briefThinkingType
                  : isTranslating
                    ? messages.hero.briefTranslatingType
                    : idea
                      ? idea.type
                      : messages.hero.briefIdleType}
              </strong>
            </div>

            <dl className="brief-fields">
              <div>
                <dt>{messages.hero.briefNiche}</dt>
                <dd>{idea && !isRolling ? idea.theme : messages.hero.briefIdleNiche}</dd>
              </div>
              <div>
                <dt>{messages.hero.briefLevel}</dt>
                <dd>{idea && !isRolling ? messages.difficulty[idea.difficulty] : messages.hero.briefIdleLevel}</dd>
              </div>
            </dl>

            <div className="brief-body">
              {isBusy ? (
                <div className="brief-skeleton" aria-hidden={!isTranslating}>
                  <span className="skeleton-line" />
                  <span className="skeleton-line" />
                  <span className="skeleton-line skeleton-line-short" />
                  {isTranslating ? (
                    <span className="brief-translating">{messages.ticket.translating}</span>
                  ) : null}
                </div>
              ) : idea ? (
                <>
                  <strong>{idea.title}</strong>
                  <p>{idea.description}</p>
                  <a className="brief-view" href="#idea-result">
                    {messages.hero.viewBrief}
                    <ArrowRight className="icon" />
                  </a>
                </>
              ) : (
                <>
                  <strong>{messages.hero.briefIdleTitle}</strong>
                  <p>{messages.hero.briefIdleText}</p>
                  <span className="brief-idle-note">{messages.hero.briefIdleNote}</span>
                </>
              )}
            </div>

            <footer className="brief-foot">
              <span className="brief-barcode" aria-hidden>
                {Array.from({ length: 28 }, (_, index) => (
                  <i key={index} />
                ))}
              </span>
              <span className="brief-seed">
                {messages.hero.seed} {idea ? idea.seed.toString(16).toUpperCase() : '—'}
              </span>
            </footer>

            <span className="brief-stamp" aria-hidden>
              {messages.hero.briefStamp}
            </span>
            <span className="brief-sticker" aria-hidden>
              <Sparkle className="icon" />
              {messages.hero.briefSticker}
            </span>

            <piix-sprite name="mochi" size="76" className="brief-sprite" />
          </article>
        </div>
      </div>
    </section>
  )
}
