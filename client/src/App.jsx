import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import ProfileCard from './components/ProfileCard'
import StaggeredMenu from './components/StaggeredMenu'
import LogoLoop from './components/LogoLoop'
import ProjectCarousel from './components/ProjectCarousel'
import CertificateStack from './components/CertificateStack'
import CountUp from './components/CountUp'
import ScrollFloat from './components/ScrollFloat'
import AdminDashboard from './components/AdminDashboard'
import AboutMe from './components/AboutMe'
import AdminLogin from './components/Auth/AdminLogin'
import ProtectedRoute from './components/common/ProtectedRoute'
import { useAuth } from './store/AuthContext'
import { defaultPortfolioContent } from './lib/portfolioContent'
import { APP_ROUTES } from './lib/appRoutes'
import { firebaseProjectId, firebaseStorageBucket } from './services/firebase'

const CONTACT = {
  phoneDisplay: '+62 895-3392-11320',
  phoneHref: 'tel:+62895339211320',
  emailDisplay: 'razwaijea6466@gmail.com',
  emailHref: 'mailto:razwaijea6466@gmail.com',
}

const NAVBAR_LOGO =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 24" fill="none">
      <path d="M11.8 2.4 21.2 12 11.8 21.6 2.4 12 11.8 2.4Z" stroke="white" stroke-width="1.6"/>
      <path d="M31 6h16v2.8H31zM31 11h24v2.8H31zM31 16h18v2.8H31z" fill="white"/>
    </svg>
  `)

const MENU_SOCIALS = [
  { label: 'Instagram', link: 'https://www.instagram.com/razzzzzwa/' },
  { label: 'X', link: 'https://x.com/RazzzzzwaToo' },
  { label: 'GitHub', link: 'https://github.com/BigManRazwa' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/razza-khoirie-4a4004389/' },
  { label: 'Linktree', link: 'https://linktr.ee/Razzzwa' },
  { label: 'Gmail', link: 'mailto:razwaijea6466@gmail.com' },
]

const FOOTER_SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/razzzzzwa/', icon: 'https://cdn.simpleicons.org/instagram/ffffff' },
  { name: 'X', href: 'https://x.com/RazzzzzwaToo', icon: 'https://cdn.simpleicons.org/x/ffffff' },
  { name: 'GitHub', href: 'https://github.com/BigManRazwa', icon: 'https://cdn.simpleicons.org/github/ffffff' },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/razza-khoirie-4a4004389/',
    icon:
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="4" width="16" height="16" rx="3" fill="white"/>
          <path d="M8.1 8.2v7.6M8.1 6.8v.2M12 10.3v5.5" stroke="black" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M12 10.3c.6-1 1.6-1.5 2.8-1.5 1.8 0 3 1.1 3 3v5.5" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `),
  },
  { name: 'Linktree', href: 'https://linktr.ee/Razzzwa', icon: 'https://cdn.simpleicons.org/linktree/ffffff' },
  { name: 'Gmail', href: 'mailto:razwaijea6466@gmail.com', icon: 'https://cdn.simpleicons.org/gmail/ffffff' },
]

const FOOTER_SOCIAL_ICON_FALLBACKS = {
  Instagram: 'https://cdn.simpleicons.org/instagram/ffffff',
  X: 'https://cdn.simpleicons.org/x/ffffff',
  GitHub: 'https://cdn.simpleicons.org/github/ffffff',
  LinkedIn:
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3" fill="white"/>
        <path d="M8.1 8.2v7.6M8.1 6.8v.2M12 10.3v5.5" stroke="black" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M12 10.3c.6-1 1.6-1.5 2.8-1.5 1.8 0 3 1.1 3 3v5.5" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `),
  Linktree: 'https://cdn.simpleicons.org/linktree/ffffff',
  Gmail: 'https://cdn.simpleicons.org/gmail/ffffff',
}

const getFooterSocialIcon = (social) =>
  social.icon || FOOTER_SOCIAL_ICON_FALLBACKS[social.name] || `https://cdn.simpleicons.org/${String(social.name || '').toLowerCase()}/ffffff`

const techLogos = [
  { src: 'https://cdn.simpleicons.org/react/ffffff', alt: 'React', title: 'React', href: 'https://react.dev/' },
  { src: 'https://cdn.simpleicons.org/nextdotjs/ffffff', alt: 'Next.js', title: 'Next.js', href: 'https://nextjs.org/' },
  { src: 'https://cdn.simpleicons.org/javascript/ffffff', alt: 'JavaScript', title: 'JavaScript', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { src: 'https://cdn.simpleicons.org/tailwindcss/ffffff', alt: 'Tailwind CSS', title: 'Tailwind CSS', href: 'https://tailwindcss.com/' },
  { src: 'https://cdn.simpleicons.org/github/ffffff', alt: 'GitHub', title: 'GitHub', href: 'https://github.com/' },
  { src: 'https://cdn.simpleicons.org/docker/ffffff', alt: 'Docker', title: 'Docker', href: 'https://www.docker.com/' },
  { src: 'https://cdn.simpleicons.org/vercel/ffffff', alt: 'Vercel', title: 'Vercel', href: 'https://vercel.com/' },
  { src: 'https://cdn.simpleicons.org/netlify/ffffff', alt: 'Netlify', title: 'Netlify', href: 'https://www.netlify.com/' },
  { src: 'https://cdn.simpleicons.org/vite/ffffff', alt: 'Vite', title: 'Vite', href: 'https://vite.dev/' },
]

const parseStatValue = (value) => {
  const rawValue = String(value ?? '').trim()
  const match = rawValue.match(/^([\d,]+(?:\.\d+)?)(.*)$/)

  if (!match) {
    return { to: 0, suffix: rawValue }
  }

  return {
    to: Number(match[1].replace(/,/g, '')),
    suffix: match[2],
  }
}

function usePortfolioContentState() {
  const [content, setContent] = useState(defaultPortfolioContent)
  const [contentSourceReady, setContentSourceReady] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [saveError, setSaveError] = useState('')
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const isApplyingRemoteUpdateRef = useRef(false)
  const isSavingRef = useRef(false)
  const queuedContentRef = useRef(null)
  const apiUrl = import.meta.env.VITE_API_URL

  const normalizeContent = (loaded) => ({
    ...defaultPortfolioContent,
    ...loaded,
    hero: {
      ...defaultPortfolioContent.hero,
      ...(loaded?.hero || {}),
    },
    introduction: {
      ...defaultPortfolioContent.introduction,
      ...(loaded?.introduction || {}),
      highlights: Array.isArray(loaded?.introduction?.highlights)
        ? loaded.introduction.highlights
        : defaultPortfolioContent.introduction.highlights,
    },
    footer: {
      ...defaultPortfolioContent.footer,
      ...(loaded?.footer || {}),
    },
    about: {
      ...defaultPortfolioContent.about,
      ...(loaded?.about || {}),
      gallery: Array.isArray(loaded?.about?.gallery) ? loaded.about.gallery : defaultPortfolioContent.about.gallery,
    },
    stats: Array.isArray(loaded?.stats) ? loaded.stats : defaultPortfolioContent.stats,
    projects: Array.isArray(loaded?.projects) ? loaded.projects : defaultPortfolioContent.projects,
    certificates: Array.isArray(loaded?.certificates) ? loaded.certificates : defaultPortfolioContent.certificates,
    uiSettings: {
      ...defaultPortfolioContent.uiSettings,
      ...(loaded?.uiSettings || {}),
    },
  })

  useEffect(() => {
    let cancelled = false
    let unsubscribe = () => {}

    const bootstrapContent = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/content`)
        const remoteContent = res.ok ? await res.json() : null

        const hasRemoteContent = remoteContent && Object.keys(remoteContent).length > 0

        if (!cancelled && hasRemoteContent) {
          isApplyingRemoteUpdateRef.current = true
          setContent(normalizeContent(remoteContent))
        }
      } catch {
        if (!cancelled) {
          setContent(defaultPortfolioContent)
        }
      } finally {
        if (!cancelled) {
          setContentSourceReady(true)
        }
      }
    }

    bootstrapContent()

    //if (portfolioDocRef) {
      //unsubscribe = onSnapshot(portfolioDocRef, (snapshot) => {
        //if (cancelled || !snapshot.exists()) {
          //return
        //}

        //isApplyingRemoteUpdateRef.current = true
        //setContent(normalizeContent(snapshot.data()))
      //})
    //}

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [apiUrl])

const persistContent = async (nextContent) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nextContent)
    });

    if (!res.ok) throw new Error("Failed to save");

    setSaveStatus('saved');
    setLastSavedAt(Date.now());
    setSaveError('');
    return true;

  } catch (error) {
    console.error("SAVE ERROR:", error);
    setSaveStatus('error');
    setSaveError('Failed to save to server');
    return false;
  }
};

  useEffect(() => {
    if (!contentSourceReady) return
    if (isApplyingRemoteUpdateRef.current) {
      isApplyingRemoteUpdateRef.current = false
      return
    }

    const timer = window.setTimeout(() => {
      void persistContent(content)
    }, 650)

    return () => window.clearTimeout(timer)
  }, [content, contentSourceReady])

  const resetContent = () => {
    setContent(defaultPortfolioContent)
    persistContent(defaultPortfolioContent)
  }

  const saveNow = () => persistContent(content)

  return [
    content,
    setContent,
    resetContent,
    contentSourceReady,
    {
      saveStatus,
      saveError,
      lastSavedAt,
    },
    saveNow,
  ]
}

function PortfolioPage({ content, showNav, setShowNav, onContentChange }) {
  const lastScrollY = useRef(0)
  const secretTapTimesRef = useRef([])
  const soundCtxRef = useRef(null)
  const customAudioRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const uiSettings = {
    ...defaultPortfolioContent.uiSettings,
    ...(content.uiSettings || {}),
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const isAtTop = y <= 10
      const isScrollingUp = y < lastScrollY.current

      setShowNav(isAtTop || isScrollingUp)
      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [setShowNav])

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.hash])

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home section', link: '/#home' },
    { label: 'Introduction', ariaLabel: 'Go to introduction section', link: '/#introduction' },
    { label: 'Projects', ariaLabel: 'Go to projects section', link: '/#projects' },
    { label: 'Certificates', ariaLabel: 'Go to certificates section', link: '/#certificates' },
  ]

  const playToggleSound = () => {
    if (!uiSettings.soundEnabled || uiSettings.soundVolume <= 0) return

    const soundSource = uiSettings.soundSource || 'synth'
    const customSoundUrl = (uiSettings.soundCustomUrl || '').trim()

    if (soundSource === 'custom' && customSoundUrl) {
      if (!customAudioRef.current || customAudioRef.current.src !== customSoundUrl) {
        customAudioRef.current = new Audio(customSoundUrl)
        customAudioRef.current.preload = 'auto'
      }

      customAudioRef.current.volume = Math.min(Math.max(uiSettings.soundVolume, 0), 1)
      customAudioRef.current.currentTime = 0
      void customAudioRef.current.play().catch(() => {})
      return
    }

    const AudioContextCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioContextCtor) return

    if (!soundCtxRef.current) {
      soundCtxRef.current = new AudioContextCtor()
    }

    const context = soundCtxRef.current
    const baseFrequency = Number(uiSettings.soundBaseFrequency ?? 330)
    const spread = Math.max(Number(uiSettings.soundSpread ?? 60), 0)
    const randomFrequency = baseFrequency + (Math.random() * 2 - 1) * spread
    const randomDuration = 0.08 + Math.random() * 0.13

    const oscillator = context.createOscillator()
    oscillator.type = uiSettings.soundWave || 'triangle'
    oscillator.frequency.value = randomFrequency

    const gain = context.createGain()
    const now = context.currentTime
    const peak = Math.min(Math.max(uiSettings.soundVolume, 0), 1) * 0.22
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + randomDuration)

    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + randomDuration + 0.01)
  }

const handleSecretSoundTap = () => {
    playToggleSound()

    const now = Date.now()
    const windowMs = Math.max(uiSettings.adminTapWindowMs || 2200, 400)
    const neededTaps = Math.max(uiSettings.adminTapCount || 10, 2)
    secretTapTimesRef.current = [...secretTapTimesRef.current, now].filter((time) => now - time <= windowMs)

    if (secretTapTimesRef.current.length >= neededTaps) {
      secretTapTimesRef.current = []
      navigate(APP_ROUTES.auth)
    }
  }

  const navigateToAboutMe = () => {
    playToggleSound()

    const now = Date.now()
    const windowMs = Math.max(uiSettings.adminTapWindowMs || 2200, 400)
    const neededTaps = Math.max(uiSettings.adminTapCount || 10, 2)
    secretTapTimesRef.current = [...secretTapTimesRef.current, now].filter((time) => now - time <= windowMs)

    if (secretTapTimesRef.current.length >= neededTaps) {
      secretTapTimesRef.current = []
      navigate(APP_ROUTES.auth)
    } else {
      navigate(APP_ROUTES.about)
    }
  }

  return (
    <div className="portfolio-page theme-night">
      <section className="hero-zone" id="home">
        <div className={`navbar-stage ${showNav ? 'navbar-stage--visible' : 'navbar-stage--hidden'}`.trim()}>
          <StaggeredMenu
            position="right"
            colors={['#101010', '#202020']}
            items={menuItems}
            socialItems={MENU_SOCIALS}
            displaySocials
            displayItemNumbering={false}
            logoUrl={NAVBAR_LOGO}
            menuButtonColor="#ffffff"
            openMenuButtonColor="#111111"
            changeMenuColorOnOpen={true}
            isFixed={true}
            accentColor="#9333ea"
            closeOnClickAway={true}
            socialTopSlot={(
              <button
                type="button"
                className="secret-sound-switch"
                onClick={handleSecretSoundTap}
                aria-label="cool sound i found this morning"
              >
                <span>cool sound i found this morning</span>
              </button>
            )}
          />
        </div>

        <div className="container hero-grid">
          <div className="hero-card-col">
            <ProfileCard
              className="w-full max-w-[360px]"
              name={content.hero.name}
              title={content.hero.title}
              handle={content.hero.handle}
              status={content.hero.status}
              contactText={content.hero.contactText}
              avatarUrl={content.hero.avatarUrl}
              miniAvatarUrl={content.hero.miniAvatarUrl}
              showUserInfo={false}
              enableTilt
              enableMobileTilt={false}
              onCardClick={navigateToAboutMe}
              onContactClick={() => {
                window.location.href = '#contact'
              }}
              behindGlowColor={content.hero.behindGlowColor}
              behindGlowEnabled
              innerGradient={content.hero.innerGradient}
            />
          </div>

          <div className="hero-copy-col">
            <p className="hero-kicker">Muhammad abdhel razza khoirie</p>
            <ScrollFloat
              containerClassName="hero-name hero-name--float"
              textClassName="hero-name__text"
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
            >
              {content.hero.pageTitle}
            </ScrollFloat>
            <p className="hero-summary">{content.hero.summary}</p>

            <div className="hero-metrics">
              {content.stats.map((stat) => (
                <article key={stat.id}>
                  {(() => {
                    const { to, suffix } = parseStatValue(stat.value)

                    return (
                      <h3>
                        <CountUp from={0} to={to} duration={1.4} separator="," className="hero-stat-value" />
                        {suffix}
                      </h3>
                    )
                  })()}
                  <p>{stat.label}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-belt-strip" id="skills">
          <div className="container hero-belt-inner">
            <LogoLoop
              logos={techLogos}
              speed={180}
              direction="right"
              width="100%"
              logoHeight={38}
              gap={56}
              pauseOnHover={false}
              fadeOut={false}
              ariaLabel="Programming technology belt"
            />
          </div>
        </div>
      </section>

      <main className="portfolio-main">
        <section className="portfolio-section section-introduction" id="introduction">
          <div className="container">
            <div className="intro-layout glass-frame glass-frame--section">
              <div className="intro-copy">
                <p className="section-eyebrow">{content.introduction.eyebrow}</p>
                <ScrollFloat
                  as="h2"
                  containerClassName="intro-title-float"
                  textClassName="intro-title-float-text"
                  animationDuration={1}
                  ease="back.inOut(2)"
                  scrollStart="center bottom+=50%"
                  scrollEnd="bottom bottom-=40%"
                  stagger={0.03}
                >
                  {content.introduction.title}
                </ScrollFloat>
                <p>{content.introduction.summary}</p>
              </div>

              <div className="intro-highlights">
                {content.introduction.highlights.map((highlight) => (
                  <article key={highlight.id}>
                    <span>{highlight.label}</span>
                    <p>{highlight.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="portfolio-section section-projects" id="projects">
          <div className="container">
            <div className="glass-frame glass-frame--section">
              <ProjectCarousel projects={content.projects} />
            </div>
          </div>
        </section>

        <section className="portfolio-section section-certificate" id="certificates">
          <div className="container">
            <CertificateStack certificates={content.certificates} />
          </div>
        </section>
      </main>

      <footer className="portfolio-footer" id="contact">
        <div className="container footer-shell">
          <div className="footer-brand-block">
            <p className="footer-kicker">{content.footer?.kicker || 'Portfolio'}</p>
            <h2>{content.footer?.brandName || 'Muhammad Abdhel Razza Khoirie'}</h2>
            <p>{content.footer?.description || 'A focused portfolio built to showcase practical engineering, clean interfaces, and work that is easy to verify.'}</p>
          </div>

          <div className="footer-meta-grid">
            <div>
              <p className="footer-meta-label">Contact</p>
              <div className="footer-contacts">
                <a href={content.footer?.phoneHref || CONTACT.phoneHref}>{content.footer?.phoneDisplay || CONTACT.phoneDisplay}</a>
                <a href={content.footer?.emailHref || CONTACT.emailHref}>{content.footer?.emailDisplay || CONTACT.emailDisplay}</a>
              </div>
            </div>

            <div>
              <p className="footer-meta-label">Socials</p>
              <div className="footer-socials" aria-label="Social links">
                {(content.footer?.socials || []).map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="footer-social-link"
                    aria-label={social.name}
                    target={social.href?.startsWith('http') ? '_blank' : undefined}
                    rel={social.href?.startsWith('http') ? 'noreferrer noopener' : undefined}
                  >
                    <img src={getFooterSocialIcon(social)} alt="" className="footer-social-icon" loading="lazy" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function AdminRoute({ content, setContent, resetContent, saveMeta, onSaveNow }) {
  const navigate = useNavigate()
  const { logout, authLoading, user } = useAuth()

  if (authLoading) {
    return <div className="admin-loading">Checking admin session...</div>
  }

  return (
    <AdminDashboard
      content={content}
      currentUser={user}
      firebaseDebug={{ projectId: firebaseProjectId, storageBucket: firebaseStorageBucket }}
      onChange={setContent}
      onReset={resetContent}
      saveMeta={saveMeta}
      onSaveNow={onSaveNow}
      onBack={() => navigate('/')}
      onLogout={async () => {
        await logout()
        navigate(APP_ROUTES.auth)
      }}
    />
  )
}

function App() {
  const [content, setContent, resetContent, contentSourceReady, saveMeta, saveNow] = usePortfolioContentState()
  const [showNav, setShowNav] = useState(true)

  if (!contentSourceReady) {
    return <div className="admin-loading">Loading portfolio content...</div>
  }

  return (
    <Routes>
      <Route path={APP_ROUTES.home} element={<PortfolioPage content={content} showNav={showNav} setShowNav={setShowNav} onContentChange={setContent} />} />
      <Route path={APP_ROUTES.about} element={<AboutMe about={content.about} onBack={() => {}} />} />
      <Route path={APP_ROUTES.auth} element={<AdminLogin />} />
      <Route
        path={APP_ROUTES.admin}
        element={
          <ProtectedRoute>
            <AdminRoute content={content} setContent={setContent} resetContent={resetContent} saveMeta={saveMeta} onSaveNow={saveNow} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
