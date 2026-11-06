const steps = [
  {
    number: '01',
    title: 'Abre el generador',
    text: 'No hay configuración, cuenta ni onboarding. Solo un botón y muchas posibilidades.',
    sprite: 'mochi',
    accent: 'lime',
  },
  {
    number: '02',
    title: 'Pulsa generar',
    text: 'Un formato y un tema al azar. La IA escribe el título, el pitch y las features. Si algo no encaja, vuelve a tirar.',
    sprite: 'bolt',
    accent: 'coral',
  },
  {
    number: '03',
    title: 'Construye',
    text: 'La idea queda en tu historial. Conviértela en una landing, un juego o lo que sea.',
    sprite: 'heart',
    accent: 'violet',
  },
] as const

export function HowItWorks() {
  return (
    <section className="section how-section" id="como-funciona">
      <div className="container">
        <div className="section-head how-head">
          <div>
            <span className="eyebrow">04 / CÓMO FUNCIONA</span>
            <h2>
              Tres pasos.
              <br />
              <em>Cero excusas.</em>
            </h2>
          </div>
          <p>
            Un generador no te dice qué construir. Te da un formato y un nicho lo bastante
            concretos como para empezar hoy.
          </p>
        </div>

        <div className="steps">
          {steps.map((step) => (
            <article className={`step step-${step.accent}`} key={step.number}>
              <div className="step-top">
                <span className="step-number">{step.number}</span>
                <piix-sprite name={step.sprite} size="64" />
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
            El formato no es el enemigo.
            <br />
            <strong>La hoja en blanco sí.</strong>
          </p>
          <span className="quote-tag">MANIFIESTO IDEA JAM</span>
        </aside>
      </div>
    </section>
  )
}
