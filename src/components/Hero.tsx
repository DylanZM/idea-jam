import { useI18n } from '../i18n'
import { ArrowDown, ArrowRight, Sparkle } from './Icons'

type HeroProps = {
  onGenerate: () => void
}

export function Hero({ onGenerate }: HeroProps) {
  const { messages } = useI18n()

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

        <div className="poster-wrap">
          <article className="poster">
            <header className="poster-top">
              <span>{messages.hero.posterTop}</span>
              <span>{messages.hero.posterEdition}</span>
            </header>

            <div className="poster-hero">
              <span className="poster-kicker">{messages.hero.posterKicker}</span>
              <h2 className="poster-title">
                <span>{messages.hero.posterTitle1}</span>
                <span className="poster-title-accent">{messages.hero.posterTitle2}</span>
                <span className="poster-title-lime">{messages.hero.posterTitle3}</span>
              </h2>
              <p>{messages.hero.posterText}</p>
            </div>

            <ol className="poster-steps">
              {messages.hero.posterSteps.map((step, index) => (
                <li key={step.title}>
                  <span className="poster-step-index">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <footer className="poster-foot">
              <span className="poster-footer-note">{messages.hero.posterFooter}</span>
              <span className="poster-key">{messages.hero.posterKey}</span>
            </footer>

            <span className="poster-sticker" aria-hidden>
              <Sparkle className="icon" />
              {messages.hero.posterSticker}
            </span>

            <piix-sprite name="mochi" size="76" className="poster-sprite" />
          </article>
        </div>
      </div>
    </section>
  )
}
