import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section'
}

/** Fades content up as it scrolls into view. Framer respects prefers-reduced-motion globally. */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const Component = as === 'section' ? motion.section : motion.div

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  )
}
