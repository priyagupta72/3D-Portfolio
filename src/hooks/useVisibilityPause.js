import { useEffect, useRef } from 'react'

export function useVisibilityPause(externalRef = null) {
  const isPausedRef = useRef(true) // start paused
  const mountRef = useRef(null)

  useEffect(() => {
    // Use external ref if provided, otherwise use mountRef
    const el = externalRef?.current || mountRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isPausedRef.current = !entry.isIntersecting
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [externalRef])

  return { isPausedRef, mountRef }
}