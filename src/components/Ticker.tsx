import { useI18n } from '../i18n'

export function Ticker() {
  const { messages } = useI18n()

  return (
    <section className="ticker" aria-label={messages.ticker.aria}>
      <piix-marquee speed="30">
        {messages.ticker.items.map((item, index) => (
          <span className="ticker-item" key={`${item}-${index}`}>
            <span className={`ticker-square ticker-square-${index % 3}`} aria-hidden />
            {item}
          </span>
        ))}
      </piix-marquee>
    </section>
  )
}
