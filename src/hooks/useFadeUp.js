import { useEffect, useRef } from 'react'

export function useFadeUp(delay = 0) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.opacity = '0'
    el.style.transform = 'translateY(28px)'
    el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}

export function useStaggerFadeUp(count, baseDelay = 0, step = 0.1) {
  const refs = useRef([])

  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return
      const delay = baseDelay + i * step
      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.unobserve(el)
          }
        },
        { threshold: 0.08 }
      )
      observer.observe(el)
    })
  }, [count, baseDelay, step])

  const setRef = (i) => (el) => { refs.current[i] = el }
  return setRef
}