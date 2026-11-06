import { ArrowUpRight, Github, Sparkle } from './Icons'

type FooterProps = {
  onGenerate: () => void
}

export function Footer({ onGenerate }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <span className="eyebrow eyebrow-invert">05 / ÚLTIMA LLAMADA</span>
            <h2>
              DALE.
              <br />
              GENERA
              <br />
              <em>OTRA.</em>
            </h2>
          </div>
          <div className="footer-action">
            <p>
              Tienes una idea nueva a un clic.
              <br />
              Lo difícil ya lo estás haciendo.
            </p>
            <button className="btn btn-orange btn-lg" type="button" onClick={onGenerate}>
              GENERAR IDEA
              <ArrowUpRight className="icon" />
            </button>
            <span className="footer-note">Sin cuenta. Sin tracking. Sin excusas.</span>
          </div>
          <piix-pal pal="boing" scale="3" />
        </div>
      </div>

      <div className="footer-bar">
        <div className="container footer-bar-inner">
          <a className="logo logo-invert" href="#top" aria-label="IDEA JAM, volver al inicio">
            <span className="logo-mark" aria-hidden>
              <Sparkle className="logo-spark" />
            </span>
            <span>
              IDEA<span className="logo-slash">/</span>JAM
            </span>
          </a>

          <p className="footer-credit">
            Hecho con React, Vite y componentes pixel de{' '}
            <a href="https://piixpal.dvkk.dev/" target="_blank" rel="noreferrer">
              Piixpal
            </a>{' '}
            (MIT).
          </p>

          <div className="footer-links">
            <a href="https://github.com/DylanZM/idea-jam" target="_blank" rel="noreferrer">
              <Github className="icon" />
              GitHub
            </a>
            <span aria-hidden>·</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
