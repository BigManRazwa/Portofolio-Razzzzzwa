import React, { useEffect, useMemo, useRef, useState } from 'react'

const MIN_COPIES = 3

const LogoLoopSimple = ({
  logos = [],
  duration = 28,
  logoHeight = 38,
  gap = 40,
  pauseOnHover = true,
  ariaLabel = 'Logo belt',
  fadeWidth = 104,
}) => {
  const containerRef = useRef(null)
  const sequenceRef = useRef(null)
  const trackRef = useRef(null)
  const rafRef = useRef(null)
  const lastTsRef = useRef(0)
  const offsetRef = useRef(0)
  const pausedRef = useRef(false)

  const [sequenceWidth, setSequenceWidth] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)

  const logosToRender = useMemo(() => (Array.isArray(logos) ? logos : []), [logos])

  useEffect(() => {
    const measure = () => {
      const nextSequenceWidth = sequenceRef.current?.scrollWidth || 0
      const nextContainerWidth = containerRef.current?.clientWidth || 0
      setSequenceWidth(nextSequenceWidth)
      setContainerWidth(nextContainerWidth)
    }

    measure()

    const observer = new ResizeObserver(measure)
    if (containerRef.current) observer.observe(containerRef.current)
    if (sequenceRef.current) observer.observe(sequenceRef.current)

    const imgNodes = sequenceRef.current?.querySelectorAll('img') || []
    imgNodes.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', measure)
        img.addEventListener('error', measure)
      }
    })

    return () => {
      observer.disconnect()
      imgNodes.forEach((img) => {
        img.removeEventListener('load', measure)
        img.removeEventListener('error', measure)
      })
    }
  }, [logosToRender])

  useEffect(() => {
    if (!trackRef.current || sequenceWidth <= 0 || logosToRender.length === 0) return

    const step = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts

      if (!pausedRef.current) {
        const pxPerSecond = duration > 0 ? sequenceWidth / duration : 60
        offsetRef.current = (offsetRef.current + dt * pxPerSecond) % sequenceWidth
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lastTsRef.current = 0
    }
  }, [duration, logosToRender.length, sequenceWidth])

  const copiesNeeded = sequenceWidth > 0 && containerWidth > 0
    ? Math.max(MIN_COPIES, Math.ceil((containerWidth * 2) / sequenceWidth) + 2)
    : MIN_COPIES

  const containerStyle = {
    overflow: 'hidden',
    width: '100%',
    display: 'block',
    position: 'relative',
    maskImage: `linear-gradient(to right, transparent 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`,
    WebkitMaskImage: `linear-gradient(to right, transparent 0, black ${fadeWidth}px, black calc(100% - ${fadeWidth}px), transparent 100%)`,
  }

  const trackStyle = {
    display: 'flex',
    alignItems: 'center',
    width: 'max-content',
    willChange: 'transform',
    transform: 'translate3d(0, 0, 0)',
    backfaceVisibility: 'hidden',
  }

  const sequenceStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: `${gap}px`,
    paddingRight: `${gap}px`,
    flex: '0 0 auto',
  }

  const imgStyle = {
    height: `${logoHeight}px`,
    width: 'auto',
    display: 'block',
    opacity: 1,
    flexShrink: 0,
  }

  return (
    <div
      ref={containerRef}
      aria-label={ariaLabel}
      role="group"
      style={containerStyle}
      onMouseEnter={pauseOnHover ? () => { pausedRef.current = true } : undefined}
      onMouseLeave={pauseOnHover ? () => { pausedRef.current = false } : undefined}
    >
      <div ref={trackRef} style={trackStyle}>
        <div ref={sequenceRef} style={sequenceStyle} aria-hidden="true">
          {logosToRender.map((l, i) => (
            <div key={`seed-${i}`} style={{ flex: '0 0 auto' }}>
              <img src={l.src || l.icon || l} alt={l.alt || l.title || ''} title={l.title || ''} style={imgStyle} />
            </div>
          ))}
        </div>

        {Array.from({ length: copiesNeeded - 1 }).map((_, idx) => (
          <div key={`copy-${idx}`} style={sequenceStyle} aria-hidden="true">
            {logosToRender.map((l, i) => (
              <div key={`copy-${idx}-${i}`} style={{ flex: '0 0 auto' }}>
                <img src={l.src || l.icon || l} alt="" aria-hidden="true" title={l.title || ''} style={imgStyle} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default React.memo(LogoLoopSimple)
