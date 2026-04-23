import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function AboutMe({ about, onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    onBack?.()
    navigate('/')
  }

  return (
    <div className="portfolio-page about-me-page">
      <div className="container about-me-container">
        <button 
          type="button" 
          className="about-me-back-btn"
          onClick={handleBack}
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <section className="about-me-section about-me-hero">
          <h1>About Me</h1>
          <p className="about-me-intro">{about.introduction}</p>
        </section>

        <section className="about-me-section">
          <h2>My Hobbies</h2>
          <div className="about-me-list">
            {about.hobbies?.map((hobby, index) => (
              <div key={index} className="about-me-item">
                <span className="about-me-bullet">→</span>
                <span>{hobby}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="about-me-section">
          <h2>Fun Facts</h2>
          <div className="about-me-list">
            {about.funFacts?.map((fact, index) => (
              <div key={index} className="about-me-item">
                <span className="about-me-bullet">✨</span>
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="about-me-section">
          <h2>My Favorites</h2>
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
        </section>

        <section className="about-me-section about-me-personality">
          <h2>Personality</h2>
          <p>{about.personality}</p>
        </section>
      </div>
    </div>
  )
}

export default AboutMe
