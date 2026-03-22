/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from 'react'
import { useFadeUp } from '../hooks/useFadeUp'
import { useVisibilityPause } from '../hooks/useVisibilityPause'

// ── SVG ICONS ──
const MouseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="7"/><line x1="12" y1="6" x2="12" y2="10"/>
  </svg>
)
const FolderIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
)
const ChevronIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
)
const PlayIcon = () => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
)

const experiences = [
  {
    id: 'sde', role: 'Software Development Engineer', company: 'Webminix',
    date: 'MAR 2026 – PRESENT', status: 'current', color: '#00D4B8', hexColor: 0x00D4B8,
    stack: 'Node.js · Express.js · MongoDB · React.js · Redis · Firebase · JWT · Swagger',
    project: 'Insta Sales | Enterprise E-commerce Platform',
    points: [
      'Leading backend with controller–service–repository architecture for 3+ user types.',
      'Redis caching achieving 35% faster response times under peak loads.',
      'Swagger API contracts reducing integration issues by 40%.',
      'JWT + Helmet + rate limiting — boosting user success actions by 20%.',
    ],
  },
  {
    id: 'intern-wmx', role: 'SDE Intern', company: 'Webminix',
    date: 'OCT 2025 – MAR 2026', status: 'completed', color: '#0099ff', hexColor: 0x0099ff,
    stack: 'Node.js · Express.js · MongoDB · React.js · Redis · Joi · JWT',
    project: 'Web Application',
    points: [
      'Built 6+ secure REST APIs for auth and creator workflows.',
      'Centralized error handling + Joi validation cutting invalid requests by 30%.',
      'Structured logging and Swagger contracts for clean integration.',
    ],
  },
  {
    id: 'intern-vel', role: 'Web Developer Intern', company: 'Velonetics',
    date: 'OCT 2024 – DEC 2024', status: 'completed', color: '#7c6aff', hexColor: 0x7c6aff,
    stack: 'React.js · Node.js · MongoDB · Tailwind CSS · REST APIs',
    project: 'Web Applications',
    points: [
      'Developed responsive web apps with clean UI and reliable API integration.',
      'Contributed to full-stack features across multiple client projects.',
      'Built strong MERN stack foundations through real-world delivery.',
    ],
  },
]

// ── LAZY THREE.JS LOADER ──
let threePromise = null
const loadThree = () => {
  if (!threePromise) threePromise = import('three').catch(() => null)
  return threePromise
}

// ── PRE-ALLOCATED vectors/colors to avoid per-frame GC pressure ──
// These are module-level singletons, reused every frame instead of `new` each time.
let _scaleVecActive = null
let _scaleVecIdle = null
let _emissiveColor = null
let _blackColor = null

// ── 3D CANVAS ──
function ThreeTimelineCanvas({ activeId, onHover, onLoadError, sectionRef }) {
  const { isPausedRef, mountRef } = useVisibilityPause(sectionRef)
  const activeRef = useRef(activeId)
  useEffect(() => { activeRef.current = activeId }, [activeId])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let cancelled = false
    const isMobile = window.innerWidth < 768

    loadThree().then((THREE) => {
      if (!THREE || cancelled) return
      const W = mount.clientWidth, H = mount.clientHeight
      if (W === 0 || H === 0) return

      // ── Init pre-allocated objects ONCE after Three.js loads ──
      if (!_scaleVecActive) {
        _scaleVecActive = new THREE.Vector3(1.7, 1.7, 1.7)
        _scaleVecIdle    = new THREE.Vector3(1, 1, 1)
        _emissiveColor   = new THREE.Color()
        _blackColor      = new THREE.Color(0)
      }

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'low-power' })
      } catch {
        onLoadError(); return
      }

      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2))
      renderer.shadowMap.enabled = false
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
      camera.position.set(0, 0, 8)

      scene.add(new THREE.AmbientLight(0xffffff, 0.25))
      const pt = new THREE.PointLight(0x00D4B8, 2, 20); pt.position.set(2, 3, 3); scene.add(pt)
      const pt2 = new THREE.PointLight(0x0055ff, 1.5, 20); pt2.position.set(-3, -2, 2); scene.add(pt2)

      const spine = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 5.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x00D4B8, metalness: 0.5, transparent: true, opacity: 0.5 })
      )
      spine.position.set(-1, 0, 0); scene.add(spine)

      const nodeMeshes = []
      const rings = []
      const cubes = []

      experiences.forEach((exp, i) => {
        const y = 1.8 - i * 1.8
        const color = new THREE.Color(exp.hexColor)

        const orb = new THREE.Mesh(
          new THREE.SphereGeometry(0.25, isMobile ? 12 : 24, isMobile ? 12 : 24),
          new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness: 0.1 })
        )
        orb.position.set(-1, y, 0)
        orb.userData = { expId: exp.id, baseY: y, index: i, color: exp.hexColor }
        scene.add(orb); nodeMeshes.push(orb)

        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.35, 0.025, 8, 32),
          new THREE.MeshBasicMaterial({ color: exp.hexColor, transparent: true, opacity: 0.5 })
        )
        ring.position.set(-1, y, 0)
        ring.userData = { follow: orb }
        scene.add(ring); rings.push(ring)

        const hLine = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 1.8, 6),
          new THREE.MeshBasicMaterial({ color: exp.hexColor, transparent: true, opacity: 0.3 })
        )
        hLine.rotation.z = Math.PI / 2; hLine.position.set(-0.1, y, 0); scene.add(hLine)

        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.12, 0.12),
          new THREE.MeshStandardMaterial({ color, metalness: 0.8, roughness: 0.2 })
        )
        cube.position.set(1.5, y + 0.3, 0.5)
        cube.userData = { floatPhase: i * 2, floatY: y + 0.3 }
        scene.add(cube); cubes.push(cube)
      })

      // Particles
      const pCount = isMobile ? 200 : 500
      const pPos = new Float32Array(pCount * 3)
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3]     = (Math.random() - 0.5) * 12
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 8
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 3
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00D4B8, size: 0.03, transparent: true, opacity: 0.25 })))

      // Raycaster
      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      const mouse = { x: 0, y: 0 }

      const onMouseMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
        const rect = mount.getBoundingClientRect()
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(nodeMeshes)
        if (hits.length > 0) {
          onHover(hits[0].object.userData.expId)
          mount.style.cursor = 'pointer'
        } else {
          mount.style.cursor = 'default'
        }
      }

      const onClick = (e) => {
        const rect = mount.getBoundingClientRect()
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(nodeMeshes)
        if (hits.length > 0) onHover(hits[0].object.userData.expId)
      }

      const onTouchEnd = (e) => {
        if (e.changedTouches.length === 0) return
        const touch = e.changedTouches[0]
        const rect = mount.getBoundingClientRect()
        pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(nodeMeshes)
        if (hits.length > 0) onHover(hits[0].object.userData.expId)
      }

      window.addEventListener('mousemove', onMouseMove)
      mount.addEventListener('click', onClick)
      mount.addEventListener('touchend', onTouchEnd, { passive: true })

      let animId, t = 0, frameCount = 0

      const animate = () => {
        animId = requestAnimationFrame(animate)
        if (isPausedRef.current) return
        frameCount++
        if (isMobile && frameCount % 2 !== 0) return
        t += 0.01

        const currentActive = activeRef.current

        nodeMeshes.forEach(m => {
          const isActive = currentActive === m.userData.expId
          m.rotation.y += 0.02

          // ── FIX 1: reuse pre-allocated vectors, no `new` per frame ──
          m.scale.lerp(isActive ? _scaleVecActive : _scaleVecIdle, 0.1)

          // ── FIX 2: reuse pre-allocated Color, no `new` per frame ──
          if (isActive) {
            _emissiveColor.set(m.userData.color)
            m.material.emissive.copy(_emissiveColor)
            m.material.emissiveIntensity = 0.4
          } else {
            m.material.emissive.copy(_blackColor)
            m.material.emissiveIntensity = 0
          }
        })

        rings.forEach(r => {
          r.position.copy(r.userData.follow.position)
          r.rotation.x = t * 1.5
          r.rotation.y = t * 0.8
        })

        cubes.forEach(c => {
          c.rotation.x += 0.02
          c.rotation.y += 0.015
          c.position.y = c.userData.floatY + Math.sin(t + c.userData.floatPhase) * 0.12
        })

        camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04
        camera.position.y += (mouse.y * 0.7 - camera.position.y) * 0.04
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        const w = mount.clientWidth, h = mount.clientHeight
        if (w === 0 || h === 0) return
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      mount._expCleanup = () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
        mount.removeEventListener('click', onClick)
        mount.removeEventListener('touchend', onTouchEnd)
        renderer.dispose()
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      }
    }).catch(() => onLoadError())

    return () => {
      cancelled = true
      const m = mountRef.current
      if (m && m._expCleanup) { m._expCleanup(); m._expCleanup = null }
    }
  }, [onHover, onLoadError])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}

// ── FALLBACK (no WebGL) ──
function FallbackTimeline({ activeId, setActiveId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', padding: '1.5rem 1rem', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '1.85rem', top: '2rem', bottom: '2rem', width: 2, background: 'linear-gradient(to bottom, #00D4B8, #0099ff, #7c6aff)', opacity: 0.3 }} />
      {experiences.map((exp, i) => (
        <div key={exp.id} style={{ display: 'flex', gap: '1rem', paddingBottom: i < experiences.length - 1 ? '1.5rem' : 0 }}>
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
            <div onClick={() => setActiveId(exp.id)} style={{
              width: 20, height: 20, borderRadius: '50%', cursor: 'pointer',
              background: activeId === exp.id ? exp.color : 'rgba(255,255,255,0.08)',
              border: `2px solid ${exp.color}`,
              boxShadow: activeId === exp.id ? `0 0 12px ${exp.color}` : 'none',
              transition: 'all 0.25s',
            }} />
          </div>
          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{exp.role}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', color: exp.color, marginBottom: '0.25rem' }}>{exp.company} · {exp.date}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Experience3D() {
  const [activeId, setActiveId] = useState('sde')
  const [threeLoaded, setThreeLoaded] = useState(false)
  const [threeSupported, setThreeSupported] = useState(true)
  const sectionRef = useRef(null)
  const headRef = useFadeUp(0)
  // const active = experiences.find(e => e.id === activeId)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) { setThreeSupported(false); return }
    } catch {
      setThreeSupported(false); return
    }
    loadThree().then(THREE => {
      if (THREE) setThreeLoaded(true)
      else setThreeSupported(false)
    }).catch(() => setThreeSupported(false))
  }, [])

  const handleHover = useCallback((id) => setActiveId(id), [])
  const handleLoadError = useCallback(() => setThreeSupported(false), [])

  return (
    <section id="experience" ref={sectionRef} style={{ padding: '6rem 5vw', background: '#060810', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <style>{`
        @keyframes exp-spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }

        .exp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 3rem;
          margin-top: 3rem;
          align-items: center;
        }

        .exp-canvas-wrap {
          height: 420px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(0,212,184,0.12);
          background: rgba(0,0,0,0.3);
          position: relative;
        }

        .exp-card {
          border-radius: 16px;
          padding: 1.4rem;
          cursor: default;
          transition: transform 0.35s ease, background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          /* FIX 3: will-change tells browser to composite this on GPU,
             avoiding layout recalc when transform/opacity change */
          will-change: transform;
          contain: layout style;
        }

        /* FIX 4: use grid rows instead of max-height for expand animation
           — grid-template-rows: 0fr → 1fr does NOT cause forced reflow
           because the browser can composite it without recalculating layout */
        .exp-card-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .exp-card-body.open {
          grid-template-rows: 1fr;
        }
        .exp-card-body-inner {
          overflow: hidden;
        }

        @media (max-width: 640px) {
          #experience { padding: 3.5rem 4vw !important; }
          .exp-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .exp-canvas-wrap { height: 260px !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div ref={headRef}>
          <div className="section-label">EXPERIENCE</div>
          <h2 className="section-title">Mission<br /><span className="section-muted">history.</span></h2>
          <p style={{
            fontFamily: "'Space Mono',monospace", fontSize: '0.58rem',
            color: 'rgba(255,255,255,0.35)', marginTop: '0.5rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <MouseIcon />
            {threeSupported ? 'Hover over a 3D node OR hover a card below' : 'Click a card to explore'}
          </p>
        </div>

        <div className="exp-grid">
          {/* 3D Canvas */}
          <div className="exp-canvas-wrap">
            {threeSupported && !threeLoaded && (
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '1rem', zIndex: 10,
              }}>
                <div style={{
                  width: 28, height: 28,
                  border: '2px solid rgba(0,212,184,0.2)',
                  borderTop: '2px solid #00D4B8',
                  borderRadius: '50%',
                  animation: 'exp-spin 0.9s linear infinite',
                }} />
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', letterSpacing: '0.18em', color: 'rgba(0,212,184,0.6)' }}>
                  LOADING...
                </span>
              </div>
            )}

            {threeSupported && threeLoaded && (
              <ThreeTimelineCanvas
                activeId={activeId}
                onHover={handleHover}
                onLoadError={handleLoadError}
                sectionRef={sectionRef}
              />
            )}

            {!threeSupported && (
              <FallbackTimeline activeId={activeId} setActiveId={setActiveId} />
            )}
          </div>

          {/* Experience cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {experiences.map(exp => {
              const isActive = activeId === exp.id
              return (
                <div
                  key={exp.id}
                  className="exp-card"
                  onMouseEnter={() => setActiveId(exp.id)}
                  onClick={() => setActiveId(exp.id)}
                  style={{
                    background: isActive ? `${exp.color}10` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? exp.color + '50' : 'rgba(255,255,255,0.07)'}`,
                    transform: isActive ? 'translateX(6px)' : 'translateX(0)',
                    boxShadow: isActive ? `0 4px 28px ${exp.color}20` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{exp.role}</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', color: exp.color, marginTop: '0.15rem' }}>{exp.company}</div>
                    </div>
                    <span style={{
                      fontFamily: "'Space Mono',monospace", fontSize: '0.48rem', letterSpacing: '0.12em',
                      color: exp.status === 'current' ? exp.color : '#9090A0',
                      background: exp.status === 'current' ? `${exp.color}15` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${exp.status === 'current' ? exp.color + '30' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: '100px', padding: '0.25rem 0.6rem',
                      display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}>
                      {exp.status === 'current' ? <><PlayIcon /> CURRENT</> : exp.date}
                    </span>
                  </div>

                  {/* FIX 4 applied: grid-rows expand, no forced reflow */}
                  <div className={`exp-card-body${isActive ? ' open' : ''}`}>
                    <div className="exp-card-body-inner">
                      <div style={{
                        fontFamily: "'Space Mono',monospace", fontSize: '0.5rem',
                        color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                      }}>
                        <span style={{ color: exp.color }}><FolderIcon /></span>
                        {exp.project}
                      </div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.48rem', color: `${exp.color}aa`, marginBottom: '0.75rem' }}>{exp.stack}</div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {exp.points.map((p, i) => (
                          <li key={i} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, paddingLeft: '1rem', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 0, color: exp.color }}>›</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {!isActive && (
                    <div style={{
                      fontFamily: "'Space Mono',monospace", fontSize: '0.5rem',
                      color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}>
                      HOVER TO EXPAND <ChevronIcon />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}