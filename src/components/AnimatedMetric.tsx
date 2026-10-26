import { useEffect, useRef } from 'react'

/** The final number remains available to assistive technology and without animation. */
export function AnimatedMetric({ value }: { value: string }) {
  const current = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = current.current
    const target = Number(value.replace(/[^0-9]/g, ''))
    if (!element || !Number.isFinite(target) || target < 1) return

    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let started = false
    let observer: IntersectionObserver | undefined
    const finish = () => {
      cancelAnimationFrame(frame)
      element.textContent = value
      observer?.disconnect()
    }
    const onPreference = () => { if (preference.matches) finish() }

    if (!preference.matches && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        if (started || !entries.some(entry => entry.isIntersecting)) return
        started = true
        observer?.disconnect()
        if (preference.matches) return
        const start = performance.now()
        const prefix = value.startsWith('+') ? '+' : ''
        element.textContent = `${prefix}0`
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1600, 1)
          element.textContent = `${prefix}${Math.floor(target * progress)}`
          if (progress < 1 && !preference.matches) frame = requestAnimationFrame(tick)
          else finish()
        }
        frame = requestAnimationFrame(tick)
      }, { threshold: .5 })
      observer.observe(element)
    }
    preference.addEventListener('change', onPreference)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      preference.removeEventListener('change', onPreference)
    }
  }, [value])

  return <span className="metric-counter">
    <span className="metric-placeholder" aria-hidden="true">{value}</span>
    <span className="metric-current" ref={current} aria-hidden="true">{value}</span>
    <span className="sr-only">{value}</span>
  </span>
}
