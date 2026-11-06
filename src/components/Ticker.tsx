const items = [
  'FORMATO',
  'NICHO',
  'TÍTULO',
  'DESCRIPCIÓN',
  'LO QUE TIENE QUE TENER',
  'DIFICULTAD',
  'IA',
  'SIN PLANTILLAS',
]

export function Ticker() {
  return (
    <section className="ticker" aria-label="Campos del brief generado con IA">
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
