import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, ChevronDown, Code, Database, Sparkles, Gamepad2, Monitor, Moon, Sun, ArrowUpRight } from 'lucide-react'
import { Experience } from './components/Experience'
import { ProjectCard } from './components/ProjectCard'
import { Reveal } from './components/Reveal'
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
  const [isLoaded, setIsLoaded] = useState(false)
  const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialTheme)

  useEffect(() => {
    setIsLoaded(true)
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
    <motion.div 
      className="app"
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      <div className="grid-overlay" />
      
      {/* Background Glows */}
      <div className="glow" style={{ top: '-10%', left: '-5%' }} />
      <div className="glow" style={{ bottom: '10%', right: '5%' }} />

      <header className="navbar">
        <nav className="container">
          <div className="logo">Jiawen Zhu</div>
          <ul className="nav-links">
            <li><a href="#projects">Projects</a></li>
            <li><a href="#experience">Experience</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <ThemeSwitcher value={themePreference} onChange={setThemePreference} />
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero container">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="badge">Full-Stack Engineer</span>
            <h1>I build AI products that feel <span className="highlight">intuitive, fast, and easy to use.</span></h1>
            <p className="hero-sub">
              I'm a full-stack engineer who loves turning complex data into clean, trustworthy experiences. 
              Whether it's an AI agent or cloud infrastructure, I focus on the small details that make 
              software actually feel good to use.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">View Projects</a>
              <div className="social-links">
                <a href="https://github.com/JiawenZhu" target="_blank" rel="noreferrer"><Github size={20} /></a>
                <a href="https://linkedin.com/in/jiawenzhu" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
                <a href="mailto:zhujiawen519@gmail.com"><Mail size={20} /></a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
            aria-hidden="true"
          >
            <img src={assetUrl('hero-google-photo.png')} alt="" />
          </motion.div>
          
          <motion.div 
            className="hero-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <ChevronDown />
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="section container">
          <Reveal className="section-header">
            <h2>Technical Implementations</h2>
            <p>Deep-dives into algorithmic complexity and system architecture.</p>
          </Reveal>

          <div className="projects-grid">
            <ProjectCard
              index={0}
              featured
              title="CCAF Quest"
              description="A walkable 3D city that turns Claude Certified Architect exam prep into a mission game. 45 missions across 5 exam domains, each anchored to a real building — walk in, take the briefing, answer, earn XP. Readiness is weighted by each domain's true share of the exam."
              tags={["Three.js", "React", "WebGL", "Game Design", "Learning"]}
              demoLink="https://careervivid.app/learning/ccaf-quest"
              demoLabel="Play the City"
              icon={<Gamepad2 size={24} />}
              image={assetUrl('project-screenshots/ccaf-quest.png')}
              imageAlt="CCAF Quest 3D city with a player character walking toward a glowing mission beacon"
              metrics={{ missions: "45 across 5 domains", engine: "Three.js r182" }}
            >
              <DomainMeter />
            </ProjectCard>
            <ProjectCard
              index={1}
              title="MegaMillions Engine"
              description="A high-performance statistical engine that processes historical lottery data using weighted sampling and recency decay algorithms to generate composite scores for predictive modeling."
              tags={["TypeScript", "Algorithms", "Statistics", "Data Processing"]}
              repoLink="https://github.com/JiawenZhu/megamillions-engine"
              icon={<Database size={24} />}
              image={assetUrl('project-screenshots/megamillions-engine.png')}
              imageAlt="MegaMillions Engine dashboard showing strategy performance cards and ROI chart"
              metrics={{ complexity: "O(n log n)", performance: "Sub-10ms processing" }}
            >
              <AlgorithmPreview />
            </ProjectCard>
            <ProjectCard
              index={2}
              title="CareerVivid"
              description="A full-stack career platform that rehearses the whole job hunt. Mock interviews replay the real staged loop for 301 companies, a 12-course curriculum runs 203 hands-on lessons, and AI-parsed resume tailoring plus a Node.js CLI automate the paperwork around it."
              tags={["React", "Firebase", "Vertex AI", "Node.js", "CLI"]}
              repoLink="https://github.com/JiawenZhu/CareerVivid"
              demoLink="https://careervivid.app"
              icon={<Code size={24} />}
              image={assetUrl('project-screenshots/careervivid.png')}
              imageAlt="CareerVivid interview quests page listing staged interview loops for Google, Amazon, Meta, and other companies"
              metrics={{ companies: "301 interview loops", backend: "Firebase + Vertex AI" }}
            />
            <ProjectCard
              index={3}
              title="TeamUSA Gemini Analyst"
              description="Analytical platform for athletic performance. Integrates Gemini AI for archetype classification and provides data visualizations for competitive intelligence."
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

        {/* Technical Expertise Section */}
        <section className="section container">
          <div className="grid-2">
            <Reveal className="expertise-text">
              <h2>Technical Expertise</h2>
              <p>Specializing in building robust, scalable applications with a focus on data integrity and algorithmic efficiency.</p>
              <div className="skills-grid">
                <div className="skill-category">
                  <h4>Backend & Algorithms</h4>
                  <ul>
                    <li>Node.js / TypeScript</li>
                    <li>Python / Data Science</li>
                    <li>Statistical Modeling</li>
                    <li>SQL / Firebase</li>
                  </ul>
                </div>
                <div className="skill-category">
                  <h4>Frontend & Design</h4>
                  <ul>
                    <li>React / Next.js</li>
                    <li>CSS / Design Systems</li>
                    <li>Framer Motion</li>
                    <li>UX Research</li>
                  </ul>
                </div>
              </div>
            </Reveal>
            <Reveal className="expertise-visual" delay={0.12}>
              {/* Subtle engineered visualization */}
              <div className="code-block-mock">
                <div className="code-header">
                  <div className="dot red" />
                  <div className="dot yellow" />
                  <div className="dot green" />
                </div>
                <div className="code-content">
                  <pre>
                    <code>{`function scoreCandidate(data) {
  const recency = Math.exp(-0.1 * data.age);
  const weight = data.frequency * recency;
  return weight * (data.score + data.bonus);
}`}</code>
                  </pre>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Experience />

        {/* Contact Section */}
        <section id="contact" className="section container">
          <Reveal className="contact-card">
            <span className="section-kicker">Get in touch</span>
            <h2>Let's build something worth using.</h2>
            <p>
              I'm open to full-stack and AI product roles, and I always enjoy talking through a hard
              data or interface problem. The fastest way to reach me is email.
            </p>
            <div className="contact-actions">
              <a className="btn btn-primary" href="mailto:zhujiawen519@gmail.com">
                <Mail size={18} aria-hidden="true" />
                <span>zhujiawen519@gmail.com</span>
              </a>
              <a className="btn btn-ghost" href="https://github.com/JiawenZhu" target="_blank" rel="noreferrer">
                <Github size={18} />
                <span>GitHub</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a className="btn btn-ghost" href="https://linkedin.com/in/jiawenzhu" target="_blank" rel="noreferrer">
                <Linkedin size={18} />
                <span>LinkedIn</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer container">
        <p>&copy; {new Date().getFullYear()} Jiawen Zhu. Engineered with precision.</p>
      </footer>
    </motion.div>
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
