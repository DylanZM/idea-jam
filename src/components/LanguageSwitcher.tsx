import type { Language } from '../types'
import { useI18n } from '../i18n'

const OPTIONS: Language[] = ['es', 'en']

export function LanguageSwitcher() {
  const { language, messages, setLanguage } = useI18n()

  return (
    <div className="lang-switcher" role="group" aria-label={messages.nav.language}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          className={`lang-btn${language === option ? ' is-active' : ''}`}
          type="button"
          aria-pressed={language === option}
          onClick={() => setLanguage(option)}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
