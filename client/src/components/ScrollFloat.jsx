import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  as: HeadingTag = 'h2',
}) => {
  const containerRef = useRef(null)

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : ''

    return text.split('').map((char, index) => (
      <span className="inline-block word" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }, [children])

  useEffect(() => {
    const el = containerRef.current

    if (!el) return undefined

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window
    const charElements = el.querySelectorAll('.inline-block')
    const containerTween = gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 24,
      },
      {
        opacity: 1,
        y: 0,
        duration: Math.max(0.45, animationDuration * 0.55),
        ease: 'power2.out',
        paused: true,
      },
    )

    const tween = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%',
      },
      {
        duration: animationDuration,
        ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger,
        paused: true,
      },
    )

    const trigger = ScrollTrigger.create({
      trigger: el,
      scroller,
      start: scrollStart,
      end: scrollEnd,
      once: true,
      onEnter: () => {
        containerTween.play(0)
        tween.play(0)
      },
      onEnterBack: () => {
        containerTween.play(0)
        tween.play(0)
      },
    })

    ScrollTrigger.refresh()

    return () => {
      trigger.kill()
      containerTween.kill()
      tween.kill()
    }
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger])

  return (
    <HeadingTag ref={containerRef} className={`my-5 overflow-hidden ${containerClassName}`.trim()}>
      <span className={`inline-block text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] ${textClassName}`.trim()}>{splitText}</span>
    </HeadingTag>
  )
}

export default ScrollFloat