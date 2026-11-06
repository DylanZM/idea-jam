import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Difficulty, Language } from './types'

export type Messages = {
  nav: {
    homeAria: string
    mainAria: string
    skip: string
    generator: string
    history: string
    howItWorks: string
    cta: string
    language: string
  }
  hero: {
    rail: string
    kicker: string
    status: string
    title1: string
    title2: string
    title3: string
    sub: string
    generate: string
    history: string
    hintBefore: string
    hintSlash: string
    hintAfter: string
    statGeneration: string
    statGenerationValue: string
    statTemplates: string
    statTemplatesValue: string
    briefTop: string
    briefNo: string
    briefFormat: string
    briefNiche: string
    briefLevel: string
    briefThinkingType: string
    briefIdleType: string
    briefIdleTitle: string
    briefIdleText: string
    briefIdleNiche: string
    briefIdleLevel: string
    briefIdleNote: string
    briefStamp: string
    briefSticker: string
    seed: string
    viewBrief: string
  }
  generator: {
    eyebrow: string
    title1: string
    title2: string
    title3: string
    intro: string
    tag: string
    machineName: string
    statusBusy: string
    statusReady: string
    statusIdle: string
    format: string
    niche: string
    placeholder: string
    generating: string
    generate: string
    generateBusy: string
    note: string
    rateNote: string
    cooldown: string
    errors: {
      generic: string
      rate: string
      day: string
      missingKey: string
    }
    thinking: string[]
  }
  ticket: {
    code: string
    brief: string
    proposal: string
    metaNiche: string
    metaLevel: string
    featuresHeading: string
    seed: string
    copy: string
    copied: string
    copyError: string
    emptyKicker: string
    emptyTitle: string
    emptyText: string
    loadingKicker: string
    loadingTitle: string
    loadingText: string
  }
  history: {
    eyebrow: string
    title: string
    intro: string
    clear: string
    confirm: string
    emptyTitle: string
    emptyText: string
    goToGenerator: string
    open: string
    openAria: string
    note: string
  }
  how: {
    eyebrow: string
    title1: string
    title2: string
    intro: string
    steps: Array<{ title: string; text: string }>
    quote1: string
    quote2: string
    quoteTag: string
  }
  footer: {
    eyebrow: string
    title1: string
    title2: string
    title3: string
    text1: string
    text2: string
    cta: string
    note: string
    creditPrefix: string
    creditSuffix: string
    github: string
    year: string
  }
  ticker: {
    aria: string
    items: string[]
  }
  difficulty: Record<Difficulty, string>
}

const es: Messages = {
  nav: {
    homeAria: 'IDEA JAM, volver al inicio',
    mainAria: 'Navegación principal',
    skip: 'Saltar al generador',
    generator: 'Generador',
    history: 'Historial',
    howItWorks: 'Cómo funciona',
    cta: 'Generar',
    language: 'Idioma',
  },
  hero: {
    rail: 'GENERADOR DE TÓPICOS / RANDOM / 2026',
    kicker: 'MÁQUINA DE TÓPICOS',
    status: 'ONLINE',
    title1: 'No sabes',
    title2: 'qué',
    title3: 'construir.',
    sub: 'La IA elige un formato y un nicho, y escribe el brief completo con una descripción clara y lo que el proyecto tiene que tener. La excusa perfecta para empezar hoy.',
    generate: 'Generar idea',
    history: 'Ver historial',
    hintBefore: 'Para otra tirada',
    hintSlash: '/',
    hintAfter: 'Ideas sin plantillas',
    statGeneration: 'Generación',
    statGenerationValue: 'IA',
    statTemplates: 'Plantillas',
    statTemplatesValue: '0',
    briefTop: 'AI BRIEF',
    briefNo: 'Nº',
    briefFormat: 'FORMATO',
    briefNiche: 'NICHO',
    briefLevel: 'NIVEL',
    briefThinkingType: 'PENSANDO…',
    briefIdleType: 'TU IDEA',
    briefIdleTitle: 'El brief aparecerá aquí',
    briefIdleText: 'Pulsa generar y la IA rellenará el formato, el nicho y los requisitos.',
    briefIdleNiche: 'Por descubrir',
    briefIdleLevel: 'Por definir',
    briefIdleNote: 'LISTO CUANDO TÚ QUIERAS',
    briefStamp: 'NO HAY EXCUSAS',
    briefSticker: 'IA',
    seed: 'SEED',
    viewBrief: 'Ver brief completo',
  },
  generator: {
    eyebrow: '02 / EL GENERADOR',
    title1: 'Tira.',
    title2: 'Mezcla.',
    title3: 'Publica.',
    intro:
      'La IA decide el formato, el nicho y escribe el brief completo. El resultado no es una idea perfecta: es una idea que puedes empezar hoy.',
    tag: 'SIN PLANTILLAS / SIN EXCUSAS',
    machineName: 'GENERADOR / 01',
    statusBusy: 'GENERANDO',
    statusReady: 'IA',
    statusIdle: 'ESPERANDO',
    format: 'FORMATO',
    niche: 'NICHO',
    placeholder: '— — —',
    generating: 'GENERANDO…',
    generate: 'Generar idea',
    generateBusy: 'Generando…',
    note: 'Un clic. Una idea. Si no te convence, vuelve a tirar.',
    rateNote: 'Límite: {minute}/min · {day}/día',
    cooldown: 'Próxima idea en {seconds}s',
    errors: {
      generic: 'No se pudo generar la idea. Revisa la clave de la IA o vuelve a intentarlo.',
      rate: 'Has alcanzado el límite de ideas. Espera un momento.',
      day: 'Has alcanzado el límite diario de ideas. Vuelve mañana.',
      missingKey: 'Falta la clave de la IA. Añádela en el archivo .env para generar ideas.',
    },
    thinking: ['Analizando el brief', 'Cruzando señales', 'Escribiendo la idea', 'Puliendo requisitos'],
  },
  ticket: {
    code: 'IDEA',
    brief: 'BRIEF',
    proposal: 'PROPUESTA',
    metaNiche: 'Nicho',
    metaLevel: 'Nivel',
    featuresHeading: 'Lo que tiene que tener',
    seed: 'SEED',
    copy: 'Copiar brief',
    copied: 'Copiado',
    copyError: 'No se pudo',
    emptyKicker: 'PROPUESTA / IA',
    emptyTitle: 'Tu próxima idea empieza aquí',
    emptyText:
      'Pulsa generar y la IA escribirá el formato, el nicho, una descripción clara y lo que el proyecto tiene que tener.',
    loadingKicker: 'PROPUESTA / GENERANDO',
    loadingTitle: 'Escribiendo tu idea',
    loadingText: 'La IA está cruzando formato, nicho y requisitos.',
  },
  history: {
    eyebrow: '03 / TU ARCHIVO',
    title: 'Historial.',
    intro:
      'Tus últimas diez ideas quedan guardadas en este navegador. Sin cuenta, sin nube, sin excusas para no volver.',
    clear: 'Vaciar',
    confirm: '¿Seguro?',
    emptyTitle: 'El historial está en blanco.',
    emptyText: 'Genera la primera idea y aparecerá aquí, lista para volver a abrirla.',
    goToGenerator: 'Ir al generador',
    open: 'Abrir idea',
    openAria: 'Abrir idea {title}',
    note: 'Guardado solo en tu navegador con localStorage. Si borras los datos del sitio, se va.',
  },
  how: {
    eyebrow: '04 / CÓMO FUNCIONA',
    title1: 'Tres pasos.',
    title2: 'Cero excusas.',
    intro:
      'La IA no te dice qué construir. Te da una idea concreta y un brief claro para empezar hoy.',
    steps: [
      {
        title: 'Abre el generador',
        text: 'No hay configuración, cuenta ni onboarding. Solo un botón y muchas posibilidades.',
      },
      {
        title: 'Pulsa generar',
        text: 'La IA decide el formato y el nicho, y escribe el título, una descripción clara y lo que el proyecto tiene que tener.',
      },
      {
        title: 'Construye',
        text: 'La idea queda en tu historial. Conviértela en una landing, un juego o lo que sea.',
      },
    ],
    quote1: 'La hoja en blanco no es el enemigo.',
    quote2: 'La IA escribe el brief.',
    quoteTag: 'MANIFIESTO IDEA JAM',
  },
  footer: {
    eyebrow: '05 / ÚLTIMA LLAMADA',
    title1: 'Dale.',
    title2: 'Genera',
    title3: 'otra.',
    text1: 'Tienes una idea nueva a un clic.',
    text2: 'Lo difícil ya lo estás haciendo.',
    cta: 'Generar idea',
    note: 'Sin cuenta. Sin tracking. Sin excusas.',
    creditPrefix: 'Hecho con React, Vite y componentes pixel de',
    creditSuffix: '(MIT).',
    github: 'GitHub',
    year: '2026',
  },
  ticker: {
    aria: 'Campos del brief generado con IA',
    items: [
      'FORMATO',
      'NICHO',
      'TÍTULO',
      'DESCRIPCIÓN',
      'LO QUE TIENE QUE TENER',
      'DIFICULTAD',
      'IA',
      'SIN PLANTILLAS',
    ],
  },
  difficulty: {
    1: 'Fácil',
    2: 'Medio',
    3: 'Ambicioso',
  },
}

const en: Messages = {
  nav: {
    homeAria: 'IDEA JAM, back to top',
    mainAria: 'Main navigation',
    skip: 'Skip to generator',
    generator: 'Generator',
    history: 'History',
    howItWorks: 'How it works',
    cta: 'Generate',
    language: 'Language',
  },
  hero: {
    rail: 'TOPIC GENERATOR / RANDOM / 2026',
    kicker: 'TOPIC MACHINE',
    status: 'ONLINE',
    title1: 'No idea',
    title2: 'what to',
    title3: 'build.',
    sub: 'AI picks a format and a niche, then writes the full brief with a clear description and what the project needs. The perfect excuse to start today.',
    generate: 'Generate idea',
    history: 'View history',
    hintBefore: 'For another roll',
    hintSlash: '/',
    hintAfter: 'Ideas without templates',
    statGeneration: 'Generation',
    statGenerationValue: 'AI',
    statTemplates: 'Templates',
    statTemplatesValue: '0',
    briefTop: 'AI BRIEF',
    briefNo: 'No.',
    briefFormat: 'FORMAT',
    briefNiche: 'NICHE',
    briefLevel: 'LEVEL',
    briefThinkingType: 'THINKING…',
    briefIdleType: 'YOUR IDEA',
    briefIdleTitle: 'Your brief will appear here',
    briefIdleText: 'Hit generate and AI will fill in the format, the niche and the requirements.',
    briefIdleNiche: 'To discover',
    briefIdleLevel: 'To define',
    briefIdleNote: 'READY WHEN YOU ARE',
    briefStamp: 'NO EXCUSES',
    briefSticker: 'AI',
    seed: 'SEED',
    viewBrief: 'View full brief',
  },
  generator: {
    eyebrow: '02 / THE GENERATOR',
    title1: 'Roll.',
    title2: 'Mix.',
    title3: 'Publish.',
    intro:
      'AI picks the format and the niche, then writes the full brief. It will not be perfect: it is an idea you can start today.',
    tag: 'NO TEMPLATES / NO EXCUSES',
    machineName: 'GENERATOR / 01',
    statusBusy: 'GENERATING',
    statusReady: 'AI',
    statusIdle: 'WAITING',
    format: 'FORMAT',
    niche: 'NICHE',
    placeholder: '— — —',
    generating: 'GENERATING…',
    generate: 'Generate idea',
    generateBusy: 'Generating…',
    note: 'One click. One idea. If it does not fit, roll again.',
    rateNote: 'Limit: {minute}/min · {day}/day',
    cooldown: 'Next idea in {seconds}s',
    errors: {
      generic: 'Could not generate the idea. Check the AI key or try again.',
      rate: 'You have reached the idea limit. Wait a moment.',
      day: 'You have reached the daily idea limit. Come back tomorrow.',
      missingKey: 'The AI key is missing. Add it to the .env file to generate ideas.',
    },
    thinking: ['Reading the brief', 'Crossing signals', 'Writing the idea', 'Polishing requirements'],
  },
  ticket: {
    code: 'IDEA',
    brief: 'BRIEF',
    proposal: 'PROPOSAL',
    metaNiche: 'Niche',
    metaLevel: 'Level',
    featuresHeading: 'What it must have',
    seed: 'SEED',
    copy: 'Copy brief',
    copied: 'Copied',
    copyError: 'Could not copy',
    emptyKicker: 'PROPOSAL / AI',
    emptyTitle: 'Your next idea starts here',
    emptyText:
      'Hit generate and AI will write the format, the niche, a clear description and what the project must have.',
    loadingKicker: 'PROPOSAL / GENERATING',
    loadingTitle: 'Writing your idea',
    loadingText: 'AI is crossing format, niche and requirements.',
  },
  history: {
    eyebrow: '03 / YOUR ARCHIVE',
    title: 'History.',
    intro:
      'Your last ten ideas stay in this browser. No account, no cloud, no excuse not to come back.',
    clear: 'Clear',
    confirm: 'Sure?',
    emptyTitle: 'Your history is empty.',
    emptyText: 'Generate the first idea and it will appear here, ready to open again.',
    goToGenerator: 'Go to generator',
    open: 'Open idea',
    openAria: 'Open idea {title}',
    note: 'Saved only in your browser with localStorage. If you clear site data, it is gone.',
  },
  how: {
    eyebrow: '04 / HOW IT WORKS',
    title1: 'Three steps.',
    title2: 'Zero excuses.',
    intro: 'AI does not tell you what to build. It gives you a concrete idea and a clear brief to start today.',
    steps: [
      {
        title: 'Open the generator',
        text: 'No setup, account or onboarding. Just one button and plenty of possibilities.',
      },
      {
        title: 'Hit generate',
        text: 'AI picks the format and the niche, then writes the title, a clear description and what the project must have.',
      },
      {
        title: 'Build it',
        text: 'The idea stays in your history. Turn it into a landing page, a game or whatever you want.',
      },
    ],
    quote1: 'The blank page is not the enemy.',
    quote2: 'AI writes the brief.',
    quoteTag: 'IDEA JAM MANIFESTO',
  },
  footer: {
    eyebrow: '05 / LAST CALL',
    title1: 'Go.',
    title2: 'Generate',
    title3: 'another.',
    text1: 'You have a new idea one click away.',
    text2: 'The hard part is already happening.',
    cta: 'Generate idea',
    note: 'No account. No tracking. No excuses.',
    creditPrefix: 'Built with React, Vite and pixel components from',
    creditSuffix: '(MIT).',
    github: 'GitHub',
    year: '2026',
  },
  ticker: {
    aria: 'Fields of the AI-generated brief',
    items: [
      'FORMAT',
      'NICHE',
      'TITLE',
      'DESCRIPTION',
      'WHAT IT MUST HAVE',
      'DIFFICULTY',
      'AI',
      'NO TEMPLATES',
    ],
  },
  difficulty: {
    1: 'Easy',
    2: 'Medium',
    3: 'Ambitious',
  },
}

export const translations: Record<Language, Messages> = { es, en }

const STORAGE_KEY = 'ideajam.language'

type I18nContextValue = {
  language: Language
  messages: Messages
  setLanguage: (language: Language) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getInitialLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
  } catch {
    // localStorage can be unavailable in private mode.
  }
  return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // The language still works for the current session.
    }
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
  }, [])

  const value = useMemo(
    () => ({ language, messages: translations[language], setLanguage }),
    [language, setLanguage],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
