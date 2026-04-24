import { useEffect, useMemo, useState } from 'react'
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

const CERTIFICATE_GROUPS = [
  {
    key: 'coding',
    label: 'Coding Certificate',
    eyebrow: 'Hands-on technical work',
    description: 'Frontend, backend, tooling, and practical development tracks.',
  },
  {
    key: 'academic',
    label: 'Academic Certificate',
    eyebrow: 'School and formal learning',
    description: 'Coursework, university records, and structured learning.',
  },
  {
    key: 'random',
    label: 'Random Certificate',
    eyebrow: 'Everything else',
    description: 'Competitions, workshops, and anything that does not fit the other lanes.',
  },
]

const normalizeCategory = (category) => {
  const safeCategory = String(category || 'coding').toLowerCase()
  return CERTIFICATE_GROUPS.some((group) => group.key === safeCategory) ? safeCategory : 'coding'
}

function CertificateStack({ certificates }) {
  const [activeCertificate, setActiveCertificate] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('coding')

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

  const groupedCertificates = useMemo(() => {
    return certificates.reduce((accumulator, certificate) => {
      const category = normalizeCategory(certificate.category)
      if (!accumulator[category]) {
        accumulator[category] = []
      }
      accumulator[category].push({ ...certificate, category })
      return accumulator
    }, {
      coding: [],
      academic: [],
      random: []
    })
  }, [certificates])

  const activeGroup = CERTIFICATE_GROUPS.find((group) => group.key === selectedGroup) || CERTIFICATE_GROUPS[0]
  const activeCertificates = groupedCertificates[selectedGroup] || []

  const openGroup = (groupKey) => {
    setSelectedGroup(groupKey)
    setIsExpanded(true)
  }

  return (
    <div className="certificate-stack-wrap glass-frame">
      <div className="section-heading-row section-heading-row--compact">
        <h2>My Certificates</h2>
        <button
          type="button"
          className="secondary-button"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Show less' : 'See more'}
        </button>
      </div>

      {!isExpanded ? (
        <div className="certificate-stack-summaryGrid">
          {CERTIFICATE_GROUPS.map((group) => {
            const items = groupedCertificates[group.key] || []
            return (
              <button
                key={group.key}
                type="button"
                className="certificate-stack-summary"
                onClick={() => openGroup(group.key)}
              >
                <div className="certificate-stack-summaryHeader">
                  <div>
                    <p className="certificate-stack-summaryEyebrow">{group.eyebrow}</p>
                    <h3>{group.label}</h3>
                  </div>
                  <span className="certificate-stack-summaryCount">{items.length} items</span>
                </div>

                <p className="certificate-stack-summaryDescription">{group.description}</p>

                <div className="certificate-stack-summaryStrip" aria-hidden="true">
                  {items.slice(0, 3).map((certificate) => (
                    <span key={certificate.id} className="certificate-stack-summaryThumb">
                      <img
                        src={certificate.imageUrl || FALLBACK_IMAGE}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE
                        }}
                      />
                    </span>
                  ))}
                  {!items.length && <span className="certificate-stack-summaryEmpty">No certificates yet</span>}
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="certificate-stack-expanded">
          <div className="certificate-stack-controls">
            <div className="certificate-stack-filterGroup" role="tablist" aria-label="Certificate categories">
              {CERTIFICATE_GROUPS.map((group) => (
                <button
                  key={group.key}
                  type="button"
                  className={`certificate-stack-filter ${selectedGroup === group.key ? 'certificate-stack-filter--active' : ''}`.trim()}
                  onClick={() => setSelectedGroup(group.key)}
                  aria-pressed={selectedGroup === group.key}
                >
                  {group.label}
                  <span>{groupedCertificates[group.key]?.length || 0}</span>
                </button>
              ))}
            </div>

            <div className="certificate-stack-controlsMeta">
              <div>
                <p>{activeGroup.eyebrow}</p>
                <h3>{activeGroup.label}</h3>
              </div>
              <p>{activeGroup.description}</p>
            </div>
          </div>

          {activeCertificates.length ? (
            <ScrollStack
              key={selectedGroup}
              className="certificate-stack"
              useWindowScroll
              itemDistance={88}
              itemStackDistance={26}
              stackPosition="18%"
              scaleEndPosition="10%"
              baseScale={0.9}
              itemScale={0.02}
              blurAmount={0.22}
            >
              {activeCertificates.map((certificate) => (
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
                      <p className="certificate-card-meta">
                        {certificate.issuer} · {certificate.date}
                      </p>
                      <h3>{certificate.title}</h3>
                    </div>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          ) : (
            <div className="certificate-stack-emptyState">
              <h3>No certificates in this category yet.</h3>
              <p>Add one from the admin panel and assign it to this lane.</p>
            </div>
          )}
        </div>
      )}

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
              <p>
                {activeCertificate.issuer} · {activeCertificate.date}
              </p>
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