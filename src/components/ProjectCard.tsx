import { useRef, type ReactNode } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ExternalLink, Globe } from 'lucide-react'

const MAX_TILT = 7
const springConfig = { stiffness: 220, damping: 24, mass: 0.5 }

export type ProjectCardProps = {
  title: string
  description: string
  tags: string[]
  icon: ReactNode
  index?: number
  repoLink?: string
  demoLink?: string
  demoLabel?: string
  image?: string
  imageAlt?: string
  featured?: boolean
  metrics?: Record<string, string>
  children?: ReactNode
}

export function ProjectCard({
  title,
  description,
  tags,
  icon,
  index = 0,
  repoLink,
  demoLink,
  demoLabel = 'Live Deployment',
  image,
  imageAlt,
  featured = false,
  metrics,
  children,
}: ProjectCardProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // Normalised pointer position across the card, 0..1 on both axes.
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)

  // Tilt away from the cursor, so the card reads as a slab being pressed.
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [-MAX_TILT, MAX_TILT]), springConfig)
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [MAX_TILT, -MAX_TILT]), springConfig)

  const glareX = useSpring(useTransform(pointerX, (value) => value * 100), springConfig)
  const glareY = useSpring(useTransform(pointerY, (value) => value * 100), springConfig)
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, var(--card-glare) 0%, transparent 58%)`

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return

    const bounds = shellRef.current?.getBoundingClientRect()
    if (!bounds) return

    pointerX.set((event.clientX - bounds.left) / bounds.width)
    pointerY.set((event.clientY - bounds.top) / bounds.height)
  }

  const resetPointer = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <motion.div
      ref={shellRef}
      className={`project-card-shell${featured ? ' featured' : ''}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <motion.article
        className="project-card"
        style={reduceMotion ? undefined : { rotateX, rotateY }}
        whileHover={reduceMotion ? undefined : { scale: 1.015 }}
        transition={{ type: 'spring', ...springConfig }}
      >
        {!reduceMotion && <motion.div className="card-glare" style={{ background: glare }} aria-hidden="true" />}

        {image && (
          <div className="project-image-frame" style={{ transform: 'translateZ(38px)' }}>
            <img src={image} alt={imageAlt || `${title} project screenshot`} loading="lazy" />
            {featured && <span className="project-flag">New</span>}
          </div>
        )}

        <div className="project-card-body">
          <div className="project-card-header" style={{ transform: 'translateZ(26px)' }}>
            <div className="project-icon">{icon}</div>
            {metrics && (
              <div className="project-metrics">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="metric">
                    <span className="metric-key">{key}</span>
                    <span className="metric-value">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h3 style={{ transform: 'translateZ(30px)' }}>{title}</h3>
          <p style={{ transform: 'translateZ(18px)' }}>{description}</p>

          {children && (
            <div className="project-custom-content" style={{ transform: 'translateZ(22px)' }}>
              {children}
            </div>
          )}

          <div className="project-tags" style={{ transform: 'translateZ(20px)' }}>
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="project-links" style={{ transform: 'translateZ(28px)' }}>
            {repoLink && (
              <a href={repoLink} className="project-link" target="_blank" rel="noreferrer">
                <span>Engineering Source</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
            {demoLink && (
              <a href={demoLink} className="project-link demo" target="_blank" rel="noreferrer">
                <span>{demoLabel}</span>
                <Globe size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
