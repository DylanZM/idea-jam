import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type PiixBase = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

interface PiixPalProps extends PiixBase {
  pal: string
  on?: string
  do?: string
  at?: string | number
  scale?: string | number
  hue?: string | number
  edge?: 'text' | 'box'
  speed?: string | number
  energy?: string | number
  length?: string | number
}

interface PiixSpriteProps extends PiixBase {
  name: string
  size?: string | number
}

interface PiixMarqueeProps extends PiixBase {
  speed?: string | number
  reverse?: boolean
}

interface PiixFlapProps extends PiixBase {
  text?: string
  length?: string | number
  countdown?: string
  theme?: string
}

interface PiixDividerProps extends PiixBase {
  kind?: string
  from?: string
  to?: string
  height?: string | number
}

interface PiixButtonProps extends PiixBase {
  tone?: 'lime' | 'coral' | 'violet' | 'sky' | 'ink'
  pal?: string
  disabled?: boolean
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'piix-pal': PiixPalProps
      'piix-sprite': PiixSpriteProps
      'piix-marquee': PiixMarqueeProps
      'piix-flap': PiixFlapProps
      'piix-divider': PiixDividerProps
      'piix-button': PiixButtonProps
    }
  }
}
