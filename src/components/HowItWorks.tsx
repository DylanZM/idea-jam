import { useI18n } from '../i18n'

const sprites = ['mochi', 'bolt', 'heart'] as const
const accents = ['lime', 'coral', 'violet'] as const

export function HowItWorks() {
  const { messages } = useI18n()

  return (
    <section className="section how-section" id="como-funciona">
      <div className="container">
        <div className="section-head how-head">
          <div>
            <span className="eyebrow">{messages.how.eyebrow}</span>
            <h2>
              {messages.how.title1}
              <br />
              <em>{messages.how.title2}</em>
            </h2>
          </div>
          <p>{messages.how.intro}</p>
        </div>

        <div className="steps">
          {messages.how.steps.map((step, index) => (
            <article className={`step step-${accents[index] ?? 'coral'}`} key={step.title}>
              <div className="step-top">
                <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
                <piix-sprite name={sprites[index] ?? 'mochi'} size="64" />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <aside className="how-quote">
          <span className="quote-mark" aria-hidden>
            “
          </span>
          <p>
            {messages.how.quote1}
            <br />
            <strong>{messages.how.quote2}</strong>
          </p>
          <span className="quote-tag">{messages.how.quoteTag}</span>
        </aside>
      </div>
    </section>
  )
}
