import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Check, Box, Code, Database, Sparkles, Gamepad2, Monitor, Moon, Sun } from 'lucide-react'
import { Experience } from './components/Experience'
import { ProjectCard } from './components/ProjectCard'
import { NowBuilding } from './components/NowBuilding'
import { CommitCity } from './components/CommitCity'
import './App.css'

const Github = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Linkedin = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

type ThemePreference = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'portfolio-theme'

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const getInitialTheme = (): ThemePreference => {
  if (typeof window === 'undefined') return 'system'

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
    ? storedTheme
    : 'system'
}

function App() {
  const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialTheme)

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  useEffect(() => {
    const applyTheme = () => {
      const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
      const resolvedTheme = themePreference === 'system' ? systemTheme : themePreference

      document.documentElement.dataset.theme = resolvedTheme
      document.documentElement.dataset.themePreference = themePreference
      document.documentElement.style.colorScheme = resolvedTheme
      window.localStorage.setItem(THEME_STORAGE_KEY, themePreference)
    }

    applyTheme()

    if (themePreference !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    mediaQuery.addEventListener('change', applyTheme)

    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [themePreference])

  return (
    <div className="app">
      <header className="navbar">
        <nav className="container">
          <a href="#top" className="logo" aria-label="Jiawen Zhu, back to top">
            <span className="logo-blocks" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            Jiawen Zhu
          </a>
          <ul className="nav-links">
            <li><a href="#projects">Work</a></li>
            <li><a href="#city">Commit city</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <ThemeSwitcher value={themePreference} onChange={setThemePreference} />
        </nav>
      </header>

      <main id="top">
        <section className="hero container">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1>Hi, I'm Jiawen. I build AI products that feel easy to use.</h1>
            <p className="hero-sub">
              I'm a full-stack engineer who turns complex data into clean, trustworthy products, from AI agents to
              cloud infrastructure. I sweat the small details that make software feel good.
            </p>

            <NowBuilding />

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">See my work</a>
              <div className="social-links">
                <a href="https://github.com/JiawenZhu" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={20} /></a>
                <a href="https://linkedin.com/in/jiawenzhu" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
                <a href="mailto:zhujiawen519@gmail.com" aria-label="Email"><Mail size={20} /></a>
              </div>
            </div>
          </motion.div>

          <Polaroid />
        </section>

        <CommitCity />

        <section id="projects" className="section container">
          <div className="section-header">
            <h2>Things I've shipped</h2>
            <p>Games, career tools, and data experiments. Tilt the cards; they like it.</p>
          </div>

          <div className="projects-grid">
            <ProjectCard
              index={0}
              featured
              title="3D Craft"
              description="An AI studio for iPhone and the web that turns an idea or a reference image into concept art, then into a 3D model you can light, inspect, animate, and drop into a game. Pick from engines like Tripo, Rodin, TRELLIS.2, and Hunyuan3D, and see the token quote before anything generates."
              tags={["SwiftUI", "React", "Firebase", "fal.ai", "3D Generation"]}
              repoLink="https://github.com/JiawenZhu/3D-Craft"
              demoLink="https://3d-craft.web.app"
              demoLabel="Open the web studio"
              appStoreLink="https://apps.apple.com/us/app/3d-craft-ai-3d-model-maker/id6811466883"
              icon={<Box size={24} />}
              image={assetUrl('project-screenshots/3d-craft.webp')}
              imageAlt="Three 3D Craft iPhone screens: a lantern-carrying cat explorer, a blue baby dragon, and a finished obsidian dragon model in the 3D studio"
              metrics={{ platforms: "iPhone, iPad, web", engines: "9 image-to-3D options" }}
            >
              <CraftPipeline />
            </ProjectCard>
            <ProjectCard
              index={1}
              title="CCAF Quest"
              description="A walkable 3D city that turns Claude Certified Architect exam prep into a mission game. 45 missions across 5 exam domains, each anchored to a real building: walk in, take the briefing, answer, earn XP. Readiness is weighted by each domain's true share of the exam."
              tags={["Three.js", "React", "WebGL", "Game Design", "Learning"]}
              demoLink="https://careervivid.app/learning/"
              demoLabel="Play the city"
              icon={<Gamepad2 size={24} />}
              image={assetUrl('project-screenshots/ccaf-quest.webp')}
              imageAlt="CCAF Quest 3D city with a player character walking toward a glowing mission beacon"
              metrics={{ missions: "45 across 5 domains", engine: "Three.js r182" }}
            >
              <DomainMeter />
            </ProjectCard>
            <ProjectCard
              index={2}
              title="MegaMillions Engine"
              description="A statistical engine that scores historical lottery data with weighted sampling, recency decay, and a Thompson-sampling bandit on top. The lottery is still winning, but now with charts."
              tags={["TypeScript", "Algorithms", "Statistics", "Data Processing"]}
              repoLink="https://github.com/JiawenZhu/megamillions-engine"
              icon={<Database size={24} />}
              image={assetUrl('project-screenshots/megamillions-engine.webp')}
              imageAlt="MegaMillions Engine dashboard showing strategy performance cards and ROI chart"
              metrics={{ complexity: "O(n log n)", performance: "Sub-10ms processing" }}
            >
              <AlgorithmPreview />
            </ProjectCard>
            <ProjectCard
              index={3}
              title="CareerVivid"
              description="A full-stack career platform that rehearses the whole job hunt. Mock interviews replay the real staged loop for 301 companies, a 12-course curriculum runs 203 hands-on lessons, and AI-parsed resume tailoring plus a Node.js CLI automate the paperwork around it."
              tags={["React", "Firebase", "Vertex AI", "Node.js", "CLI"]}
              repoLink="https://github.com/JiawenZhu/CareerVivid"
              demoLink="https://careervivid.app"
              icon={<Code size={24} />}
              image={assetUrl('project-screenshots/careervivid.webp')}
              imageAlt="CareerVivid interview quests page listing staged interview loops for Google, Amazon, Meta, and other companies"
              metrics={{ companies: "301 interview loops", backend: "Firebase + Vertex AI" }}
            />
            <ProjectCard
              index={4}
              title="TeamUSA Gemini Analyst"
              description="Matches you to an athlete archetype from 120 years of Team USA Olympic history, with Gemini classifying archetypes and data visualizations for competitive intelligence."
              tags={["Gemini AI", "Data Analytics", "React", "Competitive Intel"]}
              repoLink="https://github.com/JiawenZhu/teamusa-gemini-analyst"
              demoLink="https://teamusa-8b1ba.web.app/"
              icon={<Sparkles size={24} />}
              image={assetUrl('project-screenshots/teamusa-gemini-analyst.webp')}
              imageAlt="TeamUSA Gemini Analyst interactive globe with AI coach panel"
              metrics={{ integration: "Gemini Pro", visualizations: "D3.js" }}
            />
          </div>
        </section>

        <Experience />

        <section id="contact" className="section container">
          <div className="contact-card">
            <h2>Let's build something worth using.</h2>
            <p>
              I'm open to full-stack and AI product roles, and I always enjoy talking through a hard data or
              interface problem. Email is the fastest way to reach me.
            </p>
            <div className="contact-actions">
              <CopyEmail />
              <a className="btn btn-ghost" href="https://github.com/JiawenZhu" target="_blank" rel="noreferrer">
                <Github size={18} />
                <span>GitHub</span>
              </a>
              <a className="btn btn-ghost" href="https://linkedin.com/in/jiawenzhu" target="_blank" rel="noreferrer">
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer container">
        <p>&copy; {new Date().getFullYear()} Jiawen Zhu. Built with React and a lot of blocks.</p>
      </footer>
    </div>
  )
}

const EMAIL = 'zhujiawen519@gmail.com'

function CopyEmail() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <button type="button" className="btn btn-primary" onClick={copy}>
      {copied ? <Check size={18} aria-hidden="true" /> : <Mail size={18} aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Email copied' : 'Copy my email'}</span>
    </button>
  )
}

/** The hero photo as a polaroid you can toss around; it springs back home. */
function Polaroid() {
  const reduceMotion = useReducedMotion()
  // Touch drags would hijack page scrolling, so only mice and trackpads get to play.
  const [canDrag] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const draggable = canDrag && !reduceMotion

  return (
    <motion.figure
      className="polaroid"
      initial={{ opacity: 0, rotate: 0, y: 30 }}
      animate={{ opacity: 1, rotate: 3, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 120, damping: 14 }}
      drag={draggable}
      dragSnapToOrigin
      dragElastic={0.6}
      whileDrag={{ rotate: -6, scale: 1.04, cursor: 'grabbing' }}
    >
      <span className="tape" aria-hidden="true" />
      {/* Above the fold and the LCP element, so fetch it ahead of the lazy project shots.
          No width/height attributes: they set CSS height and cancel the aspect-ratio crop. */}
      <img src={assetUrl('hero-google-photo.webp')} alt="Jiawen, in a cap, giving a thumbs up in front of a wall of colourful foam blocks" fetchPriority="high" draggable={false} />
      <figcaption>{draggable ? 'Drag me around' : "That's me in the cap"}</figcaption>
    </motion.figure>
  )
}

function ThemeSwitcher({ value, onChange }: { value: ThemePreference; onChange: (theme: ThemePreference) => void }) {
  const options: Array<{ value: ThemePreference; label: string; icon: typeof Sun }> = [
    { value: 'light', label: 'Light theme', icon: Sun },
    { value: 'dark', label: 'Dark theme', icon: Moon },
    { value: 'system', label: 'System theme', icon: Monitor },
  ]

  return (
    <div className="theme-switcher" role="radiogroup" aria-label="Color theme">
      {options.map((option) => {
        const Icon = option.icon
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            className={`theme-option ${isActive ? 'active' : ''}`}
            aria-label={option.label}
            aria-checked={isActive}
            role="radio"
            onClick={() => onChange(option.value)}
            title={option.label}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}

/** 3D Craft's creation flow, in the order the app walks you through it. */
const CRAFT_STEPS = ['Idea', 'Concept art', '3D model', 'Game']

function CraftPipeline() {
  return (
    <ol className="craft-pipeline" aria-label="3D Craft creation steps">
      {CRAFT_STEPS.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  )
}

/** The five CCA-F exam domains, with each domain's real weight on the exam. */
const CCAF_DOMAINS = [
  { id: 'D1', label: 'Agentic Architecture', weight: 27 },
  { id: 'D2', label: 'Tool Design & MCP', weight: 18 },
  { id: 'D3', label: 'Claude Code Workflows', weight: 20 },
  { id: 'D4', label: 'Prompt Engineering', weight: 20 },
  { id: 'D5', label: 'Context & Reliability', weight: 15 },
]

function DomainMeter() {
  return (
    <div className="domain-meter" aria-label="CCA-F exam domain weighting">
      {CCAF_DOMAINS.map((domain, index) => (
        <div className="domain-row" key={domain.id}>
          <span className="domain-id">{domain.id}</span>
          <span className="domain-label">{domain.label}</span>
          <span className="domain-track">
            <motion.span
              className="domain-fill"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: domain.weight / 27 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.15 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
          <span className="domain-weight">{domain.weight}%</span>
        </div>
      ))}
    </div>
  )
}

function AlgorithmPreview() {
  const [active, setActive] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="algo-preview">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <motion.div 
          key={i}
          className={`algo-node ${active === i ? 'active' : ''}`}
          animate={{ 
            scale: active === i ? 1.2 : 1,
            opacity: active === i ? 1 : 0.4
          }}
        />
      ))}
    </div>
  );
}

export default App
