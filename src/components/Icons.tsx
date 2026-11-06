type IconProps = {
  className?: string
}

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
  focusable: false,
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3v16M5 12l7 7 7-7" />
    </svg>
  )
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 18 18 6M8 6h10v10" />
    </svg>
  )
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 12h16M12 5l7 7-7 7" />
    </svg>
  )
}

export function Copy({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="9" y="9" width="12" height="12" />
      <path d="M5 15H3V3h12v2" />
    </svg>
  )
}

export function Check({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m4 12 5 5L20 6" />
    </svg>
  )
}

export function Trash({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />
    </svg>
  )
}

export function Github({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable="false">
      <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.75-1.32-3.75-1.32-.5-1.3-1.24-1.64-1.24-1.64-1.01-.7.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15 1 1.7 2.62 1.21 3.26.93.1-.72.39-1.22.7-1.5-2.47-.28-5.07-1.24-5.07-5.5 0-1.21.43-2.2 1.14-2.98-.11-.28-.5-1.41.11-2.94 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.14-1.44 3.08-1.14 3.08-1.14.61 1.53.22 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.27-2.6 5.21-5.08 5.49.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
    </svg>
  )
}

export function Sparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden focusable="false">
      <path d="M10 2h4v6h6v4h-6v6h-4v-6H4V8h6V2Z" />
      <path d="M18 16h3v3h3v3h-3v-3h-3v-3Z" />
    </svg>
  )
}

export function Terminal({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2.5" y="4" width="19" height="16" />
      <path d="m7 9 3 3-3 3M13 15h4" />
    </svg>
  )
}
