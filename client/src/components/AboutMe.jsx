import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CircularGallery from './CircularGallery'
import ScrollFloat from './ScrollFloat'
import ScrollReveal from './ScrollReveal'

function AboutMe({ about, onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    onBack?.()
    navigate('/')
  }

  return (
    <div className="portfolio-page about-me-page">
      <div className="container about-me-container">
        <ScrollReveal as="button" type="button" className="about-me-back-btn" onClick={handleBack} aria-label="Back to home" y={12} duration={0.45}>
          <ArrowLeft size={20} />
          <span>Back</span>
        </ScrollReveal>

        <ScrollReveal as="section" className="about-me-section about-me-hero" y={30} duration={0.75}>
          <ScrollFloat as="h1" containerClassName="about-me-hero-title" textClassName="about-me-hero-title-text">
            about me
          </ScrollFloat>
          <p className="about-me-intro">{about.introduction}</p>
        </ScrollReveal>

        <ScrollReveal as="section" className="about-me-section" y={30} duration={0.75}>
          <ScrollFloat as="h2" containerClassName="about-me-heading" textClassName="about-me-heading-text">
            My Hobbies
          </ScrollFloat>
          <div className="about-me-list">
            {about.hobbies?.map((hobby, index) => (
              <div key={index} className="about-me-item">
                <span className="about-me-bullet">→</span>
                <span>{hobby}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="about-me-section about-me-gallery-section" y={30} duration={0.8}>
          <div className="section-heading-row section-heading-row--compact gallery-section-heading">
            <div>
              <ScrollFloat as="h2" containerClassName="about-me-heading about-me-gallery-title" textClassName="about-me-heading-text about-me-gallery-title-text">
                Hobby gallery
              </ScrollFloat>
              <p className="gallery-section-copy">A quick visual log of life outside the code.</p>
            </div>
          </div>
          <div className="gallery-stage about-me-gallery-stage">
            <CircularGallery
              items={(about.gallery || []).map((item) => ({ image: item.image, text: item.text }))}
              bend={3}
              textColor="#ffffff"
              borderRadius={0.08}
              scrollSpeed={2}
              scrollEase={0.05}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="about-me-section" y={30} duration={0.75}>
          <ScrollFloat as="h2" containerClassName="about-me-heading" textClassName="about-me-heading-text">
            Fun Facts
          </ScrollFloat>
          <div className="about-me-list">
            {about.funFacts?.map((fact, index) => (
              <div key={index} className="about-me-item">
                <span className="about-me-bullet">✨</span>
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="about-me-section" y={30} duration={0.75}>
          <ScrollFloat as="h2" containerClassName="about-me-heading" textClassName="about-me-heading-text">
            My Favorites
          </ScrollFloat>
          <div className="about-me-favorites-grid">
            {about.favorites?.color && (
              <div className="about-me-favorite-card">
                <div className="favorite-label">Color</div>
                <div className="favorite-value">{about.favorites.color}</div>
              </div>
            )}
            {about.favorites?.animal && (
              <div className="about-me-favorite-card">
                <div className="favorite-label">Animal</div>
                <div className="favorite-value">{about.favorites.animal}</div>
              </div>
            )}
            {about.favorites?.food && (
              <div className="about-me-favorite-card">
                <div className="favorite-label">Food</div>
                <div className="favorite-value">{about.favorites.food}</div>
              </div>
            )}
            {about.favorites?.music && (
              <div className="about-me-favorite-card">
                <div className="favorite-label">Music</div>
                <div className="favorite-value">{about.favorites.music}</div>
              </div>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal as="section" className="about-me-section about-me-personality" y={30} duration={0.8}>
          <ScrollFloat as="h2" containerClassName="about-me-heading about-me-personality-title" textClassName="about-me-heading-text about-me-personality-title-text">
            Personality
          </ScrollFloat>
          <p>{about.personality}</p>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default AboutMe
