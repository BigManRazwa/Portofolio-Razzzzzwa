import { useEffect, useState } from 'react'
import ScrollStack, { ScrollStackItem } from './ScrollStack'

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" fill="none">
      <rect width="1200" height="675" rx="28" fill="#0f0f0f"/>
      <rect x="140" y="120" width="920" height="435" rx="22" fill="#181818" stroke="#f0f0f0" stroke-width="10" opacity="0.84"/>
      <path d="M220 220h760M220 290h580M220 360h680" stroke="#f0f0f0" stroke-width="18" stroke-linecap="round" opacity="0.76"/>
    </svg>
  `)

function CertificateStack({ certificates }) {
  const [activeCertificate, setActiveCertificate] = useState(null)

  useEffect(() => {
    if (!activeCertificate) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveCertificate(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeCertificate])

  return (
    <div className="certificate-stack-wrap glass-frame">
      <div className="section-heading-row section-heading-row--compact">
        <h2>My Certificate</h2>
      </div>
      <ScrollStack
        className="certificate-stack"
        useWindowScroll
        itemDistance={84}
        itemStackDistance={24}
        stackPosition="18%"
        scaleEndPosition="10%"
        baseScale={0.9}
        itemScale={0.02}
        blurAmount={0.25}
      >
        {certificates.map((certificate) => (
          <ScrollStackItem key={certificate.id} itemClassName="certificate-stack-item">
            <div className="certificate-card">
              <button
                type="button"
                className="certificate-card-imageButton"
                onClick={() => setActiveCertificate(certificate)}
                aria-label={`View full certificate for ${certificate.title}`}
              >
                <div className="certificate-card-imageWrap">
                  <img
                    src={certificate.imageUrl || FALLBACK_IMAGE}
                    alt={certificate.title}
                    className="certificate-card-image"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE
                    }}
                  />
                </div>
              </button>
              <div className="certificate-card-content">
                <p className="certificate-card-meta">{certificate.issuer} · {certificate.date}</p>
                <h3>{certificate.title}</h3>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>

      {activeCertificate && (
        <button
          type="button"
          className="certificate-lightbox"
          onClick={() => setActiveCertificate(null)}
          aria-label={`Close full view for ${activeCertificate.title}`}
        >
          <div className="certificate-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <img
              src={activeCertificate.imageUrl}
              alt={activeCertificate.title}
              className="certificate-lightbox-image"
            />
            <div className="certificate-lightbox-meta">
              <p>{activeCertificate.issuer} · {activeCertificate.date}</p>
              <h3>{activeCertificate.title}</h3>
            </div>
            <span className="certificate-lightbox-close">Click anywhere to close</span>
          </div>
        </button>
      )}
    </div>
  )
}

export default CertificateStack
