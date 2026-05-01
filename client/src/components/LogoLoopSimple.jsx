import React from 'react'

const LogoLoopSimple = ({ logos = [], duration = 22, logoHeight = 38, gap = 40, pauseOnHover = true, ariaLabel = 'Logo belt' }) => {
  const logosToRender = logos.length ? logos : []
  const trackStyle = {
    display: 'flex',
    gap: `${gap}px`,
    alignItems: 'center',
  }

  const containerStyle = {
    overflow: 'hidden',
    width: '100%',
    display: 'block',
  }

  const scrollerStyle = {
    display: 'flex',
    alignItems: 'center',
    willChange: 'transform',
    animation: `logoLoopScroll ${duration}s linear infinite`,
  }

  const imgStyle = {
    height: `${logoHeight}px`,
    width: 'auto',
    display: 'block',
    filter: 'grayscale(0%)',
    opacity: 1,
  }

  return (
    <div aria-label={ariaLabel} role="group" style={containerStyle} className={pauseOnHover ? 'logo-loop-simple--hover-pause' : ''}>
      <style>{`
        @keyframes logoLoopScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .logo-loop-simple--hover-pause:hover > .logo-loop-simple__scroller { animation-play-state: paused; }
      `}</style>

      <div style={{ ...scrollerStyle }} className="logo-loop-simple__scroller">
        <div style={trackStyle} aria-hidden="true">
          {logosToRender.map((l, i) => (
            <div key={`a-${i}`} style={{ flex: '0 0 auto' }}>
              <img src={l.src || l.icon || l} alt={l.alt || l.title || ''} title={l.title || ''} style={imgStyle} />
            </div>
          ))}
        </div>

        {/* duplicate for seamless loop */}
        <div style={trackStyle} aria-hidden="true">
          {logosToRender.map((l, i) => (
            <div key={`b-${i}`} style={{ flex: '0 0 auto' }}>
              <img src={l.src || l.icon || l} alt={l.alt || l.title || ''} title={l.title || ''} style={imgStyle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(LogoLoopSimple)
