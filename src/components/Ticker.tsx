const items = [
  'LANDING',
  'MICRO-SAAS',
  'JUEGO WEB',
  'PORTFOLIO',
  'E-COMMERCE',
  'REVISTA',
  'DASHBOARD',
  'EXPERIMENTO',
  'SIN IMÁGENES',
  'OFFLINE',
  'SOLO TIPOGRAFÍA',
  '8-BIT',
]

export function Ticker() {
  return (
    <section className="ticker" aria-label="Categorías y restricciones">
      <piix-marquee speed="30">
        {items.map((item, index) => (
          <span className="ticker-item" key={`${item}-${index}`}>
            <span className={`ticker-square ticker-square-${index % 3}`} aria-hidden />
            {item}
          </span>
        ))}
      </piix-marquee>
    </section>
  )
}
