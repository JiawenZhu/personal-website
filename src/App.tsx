import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, ExternalLink, ChevronDown, Code, Database, Sparkles, Globe, Monitor, Moon, Sun } from 'lucide-react'
import { Experience } from './components/Experience'
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
            <h1>Engineering AI products that feel <span className="highlight">useful, fast, and human.</span></h1>
            <p className="hero-sub">
              I build full-stack systems across AI agents, data-heavy interfaces, and cloud
              infrastructure, turning complex workflows into polished products people can trust.
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
          <div className="section-header">
            <h2>Technical Implementations</h2>
            <p>Deep-dives into algorithmic complexity and system architecture.</p>
          </div>

          <div className="projects-grid">
            <ProjectCard 
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
              title="CareerVivid"
              description="A full-stack career management ecosystem. Features real-time job synchronization, AI-parsed resume tailoring, and a robust Node.js CLI for automated career operations."
              tags={["React", "Firebase", "Node.js", "CLI", "Automation"]}
              repoLink="https://github.com/JiawenZhu/CareerVivid"
              demoLink="https://careervivid.app"
              icon={<Code size={24} />}
              image={assetUrl('project-screenshots/careervivid.png')}
              imageAlt="CareerVivid landing page showing AI job search automation"
              metrics={{ users: "Hundreds", backend: "Firebase + Vertex AI" }}
            />
            <ProjectCard 
              title="TeamUSA Gemini Analyst"
              description="Analytical platform for athletic performance. Integrates Gemini AI for archetype classification and provides data visualizations for competitive intelligence."
              tags={["Gemini AI", "Data Analytics", "React", "Competitive Intel"]}
              repoLink="https://github.com/JiawenZhu/teamusa-gemini-analyst"
              demoLink="https://teamusa-8b1ba.web.app/"
              icon={<Sparkles size={24} />}
              image={assetUrl('project-screenshots/teamusa-gemini-analyst.png')}
              imageAlt="TeamUSA Gemini Analyst interactive globe with AI coach panel"
              metrics={{ integration: "Gemini Pro", visualizations: "D3.js" }}
            />
          </div>
        </section>

        {/* Technical Expertise Section */}
        <section className="section container">
          <div className="grid-2">
            <div className="expertise-text">
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
            </div>
            <div className="expertise-visual">
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
            </div>
          </div>
        </section>

        <Experience />
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

function ProjectCard({ title, description, tags, repoLink, demoLink, icon, image, imageAlt, metrics, children }: any) {
  return (
    <motion.div 
      className="project-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {image && (
        <div className="project-image-frame">
          <img src={image} alt={imageAlt || `${title} project screenshot`} loading="lazy" />
        </div>
      )}
      <div className="project-card-header">
        <div className="project-icon">{icon}</div>
        <div className="project-metrics">
          {metrics && Object.entries(metrics).map(([key, value]: any) => (
            <div key={key} className="metric">
              <span className="metric-key">{key}</span>
              <span className="metric-value">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children && <div className="project-custom-content">{children}</div>}
      <div className="project-tags">
        {tags.map((tag: string) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <div className="project-links">
        {repoLink && (
          <a href={repoLink} className="project-link" target="_blank" rel="noreferrer">
            <span>Engineering Source</span>
            <ExternalLink size={14} />
          </a>
        )}
        {demoLink && (
          <a href={demoLink} className="project-link demo" target="_blank" rel="noreferrer">
            <span>Live Deployment</span>
            <Globe size={14} />
          </a>
        )}
      </div>
    </motion.div>
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
