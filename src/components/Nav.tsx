import { useI18n } from '../i18n'
import { ArrowDown, Sparkle } from './Icons'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Nav() {
  const { messages } = useI18n()

  return (
    <header className="nav">
      <div className="nav-inner container">
        <a className="logo" href="#top" aria-label={messages.nav.homeAria}>
          <span className="logo-mark" aria-hidden>
            <Sparkle className="logo-spark" />
          </span>
          <span>
            IDEA<span className="logo-slash">/</span>JAM
          </span>
        </a>

        <div className="nav-actions">
          <nav className="nav-links" aria-label={messages.nav.mainAria}>
            <a href="#generador">{messages.nav.generator}</a>
            <a href="#historial">{messages.nav.history}</a>
            <a href="#como-funciona">{messages.nav.howItWorks}</a>
          </nav>

          <LanguageSwitcher />

          <a className="btn btn-blue btn-sm nav-cta" href="#generador">
            {messages.nav.cta}
            <ArrowDown className="icon" />
          </a>
        </div>
      </div>
    </header>
  )
}
