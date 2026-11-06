import { ArrowDownIcon } from '@animateicons/react/lucide/arrow-down-icon'
import { ArrowRightIcon } from '@animateicons/react/lucide/arrow-right-icon'
import { ArrowUpRightIcon } from '@animateicons/react/lucide/arrow-up-right-icon'
import { CheckIcon } from '@animateicons/react/lucide/check-icon'
import { CopyIcon } from '@animateicons/react/lucide/copy-icon'
import { GithubIcon } from '@animateicons/react/lucide/github-icon'
import { LightbulbIcon } from '@animateicons/react/lucide/lightbulb-icon'
import { SparklesIcon } from '@animateicons/react/lucide/sparkles-icon'
import { TerminalIcon } from '@animateicons/react/lucide/terminal-icon'
import { TrashIcon } from '@animateicons/react/lucide/trash-icon'

type IconProps = {
  className?: string
  size?: number
}

export function ArrowDown({ className, size = 18 }: IconProps) {
  return <ArrowDownIcon size={size} className={className} />
}

export function ArrowUpRight({ className, size = 18 }: IconProps) {
  return <ArrowUpRightIcon size={size} className={className} />
}

export function ArrowRight({ className, size = 18 }: IconProps) {
  return <ArrowRightIcon size={size} className={className} />
}

export function Copy({ className, size = 18 }: IconProps) {
  return <CopyIcon size={size} className={className} />
}

export function Check({ className, size = 18 }: IconProps) {
  return <CheckIcon size={size} className={className} />
}

export function Trash({ className, size = 18 }: IconProps) {
  return <TrashIcon size={size} className={className} />
}

export function Github({ className, size = 18 }: IconProps) {
  return <GithubIcon size={size} className={className} />
}

export function Sparkle({ className, size = 18 }: IconProps) {
  return <SparklesIcon size={size} className={className} />
}

export function Terminal({ className, size = 18 }: IconProps) {
  return <TerminalIcon size={size} className={className} />
}

export function Lightbulb({ className, size = 20 }: IconProps) {
  return <LightbulbIcon size={size} className={className} />
}
