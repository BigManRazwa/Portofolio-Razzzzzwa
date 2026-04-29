import { ChevronLeft, ChevronRight, GitHub } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
      <rect width="1200" height="675" rx="28" fill="#0f0f0f"/>
      <path d="M120 530 365 315 530 460 760 235 1080 530" stroke="#f0f0f0" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"/>
      <circle cx="350" cy="230" r="48" fill="#f0f0f0" opacity="0.72"/>
    </svg>
  `)

function ProjectCarousel({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const totalProjects = projects.length

  const safeIndex = useMemo(() => {
    if (totalProjects === 0) return 0
    return ((activeIndex % totalProjects) + totalProjects) % totalProjects
  }, [activeIndex, totalProjects])

  const goPrev = () => {
    setActiveIndex((current) => current - 1)
  }

  const goNext = () => {
    setActiveIndex((current) => current + 1)
  }

  useEffect(() => {
    if (activeIndex >= totalProjects && totalProjects > 0) {
      setActiveIndex(0)
    }
  }, [activeIndex, totalProjects])

  if (!totalProjects) {
    return null
  }

  return (
    <div className="project-carousel-shell glass-frame">
      <div className="section-heading-row section-heading-row--compact">
        <h2>My Projects</h2>
      </div>

      <div className="project-carousel-viewport" tabIndex={0} aria-label="Project carousel">
        <div
          className="project-carousel-track"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {projects.map((project, index) => (
            <article key={project.id} className="project-carousel-card" aria-hidden={index !== safeIndex}>
              <div className="project-carousel-file">
            <div className="project-carousel-imageWrap">
              <img
                src={project.imageUrl || FALLBACK_IMAGE}
                alt={project.title}
                className="project-carousel-image"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE
                }}
              />
              <span className="project-carousel-tag">{project.tag}</span>
              <div className="carousel-controls carousel-controls--overlay" aria-label="Carousel controls">
                <button type="button" onClick={goPrev} aria-label="Previous project">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={goNext} aria-label="Next project">
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="project-carousel-actions">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-carousel-visit-btn"
                    aria-label={`Visit ${project.title}`}
                    style={{ position: 'relative', inset: 'auto' }}
                  >
                    Visit
                  </a>
                )}
                {project.gitRepoUrl && (
                  <a
                    href={project.gitRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-carousel-visit-btn project-carousel-visit-btn--repo"
                    aria-label={`View ${project.title} repository`}
                    style={{ position: 'relative', inset: 'auto', gap: '0.35rem' }}
                  >
                    <GitHub size={16} /> Repo
                  </a>
                )}
              </div>
            </div>
            <div className="project-carousel-content">
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
            </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="carousel-footer">
        <p className="carousel-counter">
          {String(safeIndex + 1).padStart(2, '0')}/{String(totalProjects).padStart(2, '0')}
        </p>
        <div className="carousel-dots" aria-label="Project positions">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={index === safeIndex ? 'carousel-dot carousel-dot--active' : 'carousel-dot'}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to project ${index + 1}`}
              aria-pressed={index === safeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectCarousel
