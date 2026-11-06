import { ArrowDown, Sparkle } from './Icons'

export function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner container">
        <a className="logo" href="#top" aria-label="IDEA JAM, volver al inicio">
          <span className="logo-mark" aria-hidden>
            <Sparkle className="logo-spark" />
          </span>
          <span>
            IDEA<span className="logo-slash">/</span>JAM
          </span>
        </a>

        <nav className="nav-links" aria-label="Navegación principal">
          <a href="#generador">Generador</a>
          <a href="#historial">Historial</a>
          <a href="#como-funciona">Cómo funciona</a>
        </nav>

        <a className="btn btn-blue btn-sm nav-cta" href="#generador">
          GENERAR
          <ArrowDown className="icon" />
        </a>
      </div>
    </header>
  )
}
