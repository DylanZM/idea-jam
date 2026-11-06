const items = [
  'LANDING',
  'MICRO-SAAS',
  'JUEGO WEB',
  'PORTFOLIO',
  'E-COMMERCE',
  'REVISTA',
  'DASHBOARD',
  'EXPERIMENTO',
  'CAFÉ DE ESPECIALIDAD',
  'PLANTAS DE INTERIOR',
  'ASTRONOMÍA AMATEUR',
  'CICLISMO URBANO',
  'FOTOGRAFÍA ANALÓGICA',
  'VINILOS DE SEGUNDA MANO',
]

export function Ticker() {
  return (
    <section className="ticker" aria-label="Formatos y nichos">
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
