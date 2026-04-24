import { Children, useCallback, useLayoutEffect, useRef } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const parseLength = (value, containerSize) => {
  if (typeof value === 'string' && value.includes('%')) {
    return (parseFloat(value) / 100) * containerSize
  }

  const numericValue = Number.parseFloat(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card absolute inset-0 flex items-stretch justify-center ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }}
  >
    {children}
  </div>
)

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 84,
  itemScale = 0.05,
  itemStackDistance = 26,
  stackPosition = '18%',
  scaleEndPosition = '10%',
  baseScale = 0.9,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const rootRef = useRef(null)
  const sceneRef = useRef(null)
  const cardsRef = useRef([])
  const lastTransformsRef = useRef(new Map())
  const completionRef = useRef(false)
  const rafRef = useRef(0)
  const childCount = Children.count(children)

  const getScrollMetrics = useCallback(() => {
    const scene = sceneRef.current
    const root = rootRef.current

    if (!scene || (!useWindowScroll && !root)) {
      return null
    }

    if (useWindowScroll) {
      const rect = scene.getBoundingClientRect()

      return {
        scrollTop: window.scrollY,
        viewportHeight: window.innerHeight,
        sceneTop: window.scrollY + rect.top,
        sceneHeight: scene.offsetHeight
      }
    }

    return {
      scrollTop: root.scrollTop,
      viewportHeight: root.clientHeight,
      sceneTop: scene.offsetTop,
      sceneHeight: scene.offsetHeight
    }
  }, [useWindowScroll])

  const updateTransforms = useCallback(() => {
    const metrics = getScrollMetrics()
    const cards = cardsRef.current

    if (!metrics || !cards.length) {
      return
    }

    const { scrollTop, viewportHeight, sceneTop, sceneHeight } = metrics
    const scrollRange = Math.max(sceneHeight - viewportHeight, 1)
    const sceneProgress = clamp((scrollTop - sceneTop) / scrollRange, 0, 1)
    const cardCount = cards.length
    const maxIndex = Math.max(cardCount - 1, 1)
    const activeIndex = sceneProgress * maxIndex
    const stackPositionPx = parseLength(stackPosition, viewportHeight)
    const scaleEndPositionPx = parseLength(scaleEndPosition, viewportHeight)
    const revealRange = Math.max(scaleEndPositionPx - stackPositionPx, 1)

    cards.forEach((card, index) => {
      if (!card) {
        return
      }

      const distance = index - activeIndex
      const absDistance = Math.abs(distance)
      const depth = index / maxIndex
      const targetScale = clamp(1 - absDistance * itemScale, baseScale, 1)
      const revealProgress = clamp((scrollTop - (sceneTop + stackPositionPx + depth * itemDistance)) / revealRange, 0, 1)
      const scale = 1 - revealProgress * (1 - targetScale)
      const translateY = distance * itemStackDistance + (sceneProgress - 0.5) * itemDistance * 0.35
      const rotation = rotationAmount ? distance * rotationAmount * 0.75 : 0
      const blur = blurAmount ? Math.max(0, absDistance - 1) * blurAmount * 8 : 0
      const opacity = clamp(1 - absDistance * 0.16, 0.28, 1)

      const nextTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
        opacity: Math.round(opacity * 1000) / 1000
      }

      const previousTransform = lastTransformsRef.current.get(index)
      const hasChanged =
        !previousTransform ||
        Math.abs(previousTransform.translateY - nextTransform.translateY) > 0.1 ||
        Math.abs(previousTransform.scale - nextTransform.scale) > 0.001 ||
        Math.abs(previousTransform.rotation - nextTransform.rotation) > 0.1 ||
        Math.abs(previousTransform.blur - nextTransform.blur) > 0.1 ||
        Math.abs(previousTransform.opacity - nextTransform.opacity) > 0.01

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`
        card.style.filter = nextTransform.blur > 0 ? `blur(${nextTransform.blur}px)` : 'none'
        card.style.opacity = String(nextTransform.opacity)
        card.style.zIndex = String(Math.round(1000 - absDistance * 10))

        lastTransformsRef.current.set(index, nextTransform)
      }
    })

    const stackComplete = sceneProgress >= 0.94
    if (stackComplete !== completionRef.current) {
      completionRef.current = stackComplete
      if (stackComplete) {
        onStackComplete?.()
      }
    }
  }, [
    getScrollMetrics,
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete
  ])

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current) {
      return
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0
      updateTransforms()
    })
  }, [updateTransforms])

  useLayoutEffect(() => {
    const root = rootRef.current
    const scene = sceneRef.current

    if (!root || !scene) {
      return undefined
    }

    const cards = Array.from(scene.querySelectorAll('.scroll-stack-card'))
    cardsRef.current = cards
    lastTransformsRef.current.clear()
    completionRef.current = false

    cards.forEach((card, index) => {
      card.style.willChange = 'transform, filter, opacity'
      card.style.transformOrigin = 'center top'
      card.style.backfaceVisibility = 'hidden'
      card.style.webkitTransform = 'translateZ(0)'
      card.style.transform = 'translateZ(0)'
      card.style.pointerEvents = 'auto'
      card.style.transition = `opacity ${scaleDuration}s ease`
      card.style.zIndex = String(1000 - index)
    })

    const target = useWindowScroll ? window : root
    target.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(scheduleUpdate) : null
    resizeObserver?.observe(scene)

    scheduleUpdate()

    return () => {
      target.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)

      if (resizeObserver) {
        resizeObserver.disconnect()
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }

      cardsRef.current = []
      lastTransformsRef.current.clear()
      completionRef.current = false
      rafRef.current = 0
    }
  }, [childCount, scaleDuration, scheduleUpdate, useWindowScroll])

  const rootClassName = useWindowScroll
    ? `relative w-full overflow-visible ${className}`.trim()
    : `relative w-full h-screen overflow-y-auto overflow-x-hidden ${className}`.trim()

  const sceneMinHeight = `calc(100vh + ${Math.max(childCount - 1, 0) * 72}vh + 10rem)`

  return (
    <div ref={rootRef} className={rootClassName} style={{ overscrollBehavior: 'contain' }}>
      <section
        ref={sceneRef}
        className="scroll-stack-scene relative w-full"
        style={{ minHeight: sceneMinHeight }}
      >
        <div className="scroll-stack-viewport">
          <div className="scroll-stack-stage">{children}</div>
        </div>
      </section>
    </div>
  )
}

export default ScrollStack