import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollReveal({
  children,
  className = '',
  as: ElementTag = 'div',
  delay = 0,
  duration = 0.7,
  y = 28,
  ease = 'power3.out',
  scrollStart = 'top 88%',
  scrollEnd = 'bottom bottom-=40%',
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    const tween = gsap.fromTo(
      el,
      {
        opacity: 0,
        y,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease,
        paused: true,
      },
    )

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: scrollStart,
      end: scrollEnd,
      once: true,
      onEnter: () => tween.play(0),
      onEnterBack: () => tween.play(0),
    })

    return () => {
      trigger.kill()
      tween.kill()
    }
  }, [delay, duration, ease, scrollStart, scrollEnd, y])

  return (
    <ElementTag ref={ref} className={className} {...rest}>
      {children}
    </ElementTag>
  )
}