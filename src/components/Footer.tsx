import { useI18n } from '../i18n'
import { ArrowUpRight, Github, Lightbulb } from './Icons'

type FooterProps = {
  onGenerate: () => void
}

export function Footer({ onGenerate }: FooterProps) {
  const { messages } = useI18n()

  return (
    <footer className="footer">
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <span className="eyebrow eyebrow-invert">{messages.footer.eyebrow}</span>
            <h2>
              {messages.footer.title1}
              <br />
              {messages.footer.title2}
              <br />
              <em>{messages.footer.title3}</em>
            </h2>
          </div>
          <div className="footer-action">
            <p>
              {messages.footer.text1}
              <br />
              {messages.footer.text2}
            </p>
            <button className="btn btn-orange btn-lg" type="button" onClick={onGenerate}>
              {messages.footer.cta}
              <ArrowUpRight className="icon" />
            </button>
            <span className="footer-note">{messages.footer.note}</span>
          </div>
          <piix-pal pal="boing" scale="3" />
        </div>
      </div>

      <div className="footer-bar">
        <div className="container footer-bar-inner">
          <a className="logo logo-invert" href="#top" aria-label={messages.nav.homeAria}>
            <span className="logo-mark" aria-hidden>
              <Lightbulb className="logo-spark" size={20} />
            </span>
            <span>
              IDEA<span className="logo-slash">/</span>JAM
            </span>
          </a>

          <p className="footer-credit">
            {messages.footer.creditPrefix}{' '}
            <a href="https://piixpal.dvkk.dev/" target="_blank" rel="noreferrer">
              Piixpal
            </a>{' '}
            {messages.footer.creditSuffix}
          </p>

          <div className="footer-links">
            <a href="https://github.com/DylanZM/idea-jam" target="_blank" rel="noreferrer">
              <Github className="icon" />
              {messages.footer.github}
            </a>
            <span aria-hidden>·</span>
            <span>{messages.footer.year}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
