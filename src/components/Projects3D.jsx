/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from 'react'
import { useFadeUp } from '../hooks/useFadeUp'
import { useVisibilityPause } from '../hooks/useVisibilityPause'

// ── SVG ICONS ──
const FarmIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
)

const EduIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
)

const CryptoIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

const ExternalLinkIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/>
    <polyline points="7,7 17,7 17,17"/>
  </svg>
)

const GithubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)

const projects = [
  {
    id: 'farmai',
    title: 'FarmAI',
    subtitle: 'Smart Agriculture Assistant',
    desc: 'AI-powered crop & fertilizer recommendations with 92% prediction accuracy using real soil and climate data.',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Gemini AI', 'Tailwind'],
    icon: FarmIcon,
    badge: '92% ACCURACY',
    color: '#00D4B8',
    hexColor: 0x00D4B8,
    liveUrl: 'https://farmai-2-m5gc.onrender.com/',
    githubUrl: 'https://github.com/priyagupta72/FarmAI_',
    stat: '92%',
    statLabel: 'Accuracy',
  },
  {
    id: 'zevora',
    title: 'Zevora Tech',
    subtitle: 'Education Services Platform',
    desc: 'Full-stack education platform with 100+ AI-automated course recommendations via Gemini AI.',
    tags: ['React.js', 'Node.js', 'MongoDB', 'Gemini AI', 'Tailwind CSS'],
    icon: EduIcon,
    badge: 'AI-POWERED',
    color: '#0099ff',
    hexColor: 0x0099ff,
    liveUrl: 'https://zevoraa.onrender.com/',
    githubUrl: 'https://github.com/priyagupta72/Zevora',
    stat: '100+',
    statLabel: 'AI Recs',
  },
  {
    id: 'crypto',
    title: 'CryptoTracker',
    subtitle: 'Live Crypto Dashboard',
    desc: 'Real-time prices for 50+ digital assets via CoinGecko APIs. Fully mobile-responsive interface.',
    tags: ['React.js', 'Express.js', 'MongoDB', 'CoinGecko API'],
    icon: CryptoIcon,
    badge: 'REAL-TIME',
    color: '#7c6aff',
    hexColor: 0x7c6aff,
    liveUrl: 'https://crypto-tracker-inky-nine.vercel.app/',
    githubUrl: 'https://github.com/priyagupta72/CryptoTraker',
    stat: '50+',
    statLabel: 'Live Assets',
  },
]

// ── LAZY THREE.JS LOADER (singleton promise so it only loads once) ──
let threePromise = null
const loadThree = () => {
  if (!threePromise) threePromise = import('three').catch(() => null)
  return threePromise
}

// ── 3D SCENE ──
function AssemblyCanvas({ focusId, onCardHover, assembled, onLoadError, sectionRef }) {
  const { isPausedRef, mountRef } = useVisibilityPause(sectionRef)
  const stateRef = useRef({ focusId, assembled })

  useEffect(() => { stateRef.current = { focusId, assembled } }, [focusId, assembled])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    let cancelled = false
    const isMobile = window.innerWidth < 768

    loadThree().then((THREE) => {
      if (!THREE || cancelled) return
      let W = mount.clientWidth, H = mount.clientHeight
      if (W === 0 || H === 0) return

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
      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200)
      camera.position.set(0, 2, isMobile ? 13 : 10)

      scene.add(new THREE.AmbientLight(0x111122, 0.8))
      const ptMain = new THREE.PointLight(0x00D4B8, 3, 30)
      ptMain.position.set(0, 5, 5)
      scene.add(ptMain)
      projects.forEach((p, i) => {
        const pt = new THREE.PointLight(p.hexColor, 1.2, 15)
        pt.position.set((i - 1) * 5, 2, 2)
        scene.add(pt)
      })

      const cardGroups = []
      const scatterPos = [
        new THREE.Vector3(-6, 3, -4),
        new THREE.Vector3(7, -2, -6),
        new THREE.Vector3(-3, -4, 2),
      ]
      const assembledPos = isMobile ? [
        new THREE.Vector3(-2.2, 0, 0),
        new THREE.Vector3(0, 0, 1.5),
        new THREE.Vector3(2.2, 0, 0),
      ] : [
        new THREE.Vector3(-3.5, 0, 0),
        new THREE.Vector3(0, 0, 1.5),
        new THREE.Vector3(3.5, 0, 0),
      ]

      projects.forEach((proj, i) => {
        const group = new THREE.Group()

        const cardGeo = new THREE.BoxGeometry(2.4, 3.2, 0.06)
        const cardMat = new THREE.MeshStandardMaterial({
          color: proj.hexColor, metalness: 0.6, roughness: 0.2,
          transparent: true, opacity: 0.15, side: THREE.DoubleSide,
        })
        const card = new THREE.Mesh(cardGeo, cardMat)
        group.add(card)

        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(cardGeo),
          new THREE.LineBasicMaterial({ color: proj.hexColor, transparent: true, opacity: 0.8 })
        )
        group.add(edges)

        const barGeo = new THREE.BoxGeometry(2.4, 0.08, 0.07)
        const bar = new THREE.Mesh(barGeo, new THREE.MeshStandardMaterial({
          color: proj.hexColor, metalness: 1, roughness: 0,
          emissive: new THREE.Color(proj.hexColor), emissiveIntensity: 0.6,
        }))
        bar.position.set(0, 1.56, 0)
        group.add(bar)

        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, isMobile ? 12 : 24, isMobile ? 12 : 24),
          new THREE.MeshStandardMaterial({
            color: proj.hexColor, metalness: 0.9, roughness: 0.05,
            emissive: new THREE.Color(proj.hexColor), emissiveIntensity: 0.25,
          })
        )
        sphere.position.set(-0.75, 0.7, 0.1)
        group.add(sphere)

        const sWire = new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 8, 8),
          new THREE.MeshBasicMaterial({ color: proj.hexColor, wireframe: true, transparent: true, opacity: 0.35 })
        )
        sWire.position.copy(sphere.position)
        group.add(sWire)

        for (let b = 0; b < 3; b++) {
          const bh = 0.12 + Math.random() * 0.3
          const bMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.18, bh, 0.05),
            new THREE.MeshStandardMaterial({
              color: proj.hexColor, transparent: true, opacity: 0.5 + b * 0.15,
              emissive: new THREE.Color(proj.hexColor), emissiveIntensity: 0.2,
            })
          )
          bMesh.position.set(-0.9 + b * 0.28, -1.0 + bh / 2, 0.08)
          group.add(bMesh)
        }

        const corners = [[-1.1, 1.5], [1.1, 1.5], [-1.1, -1.5], [1.1, -1.5]]
        corners.forEach(([cx, cy]) => {
          const corner = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.12, 0.08),
            new THREE.MeshStandardMaterial({
              color: proj.hexColor, emissive: new THREE.Color(proj.hexColor),
              emissiveIntensity: 0.5, metalness: 1,
            })
          )
          corner.position.set(cx, cy, 0.05)
          group.add(corner)
        })

        group.position.copy(scatterPos[i])
        group.rotation.set(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1
        )
        group.userData = {
          id: proj.id, index: i, color: proj.hexColor,
          scatterPos: scatterPos[i].clone(),
          assembledPos: assembledPos[i].clone(),
          card, sphere, sWire,
          floatPhase: i * 2.1,
        }
        scene.add(group)
        cardGroups.push(group)
      })

      // Particles — fewer on mobile
      const pCount = isMobile ? 300 : 800
      const pPos = new Float32Array(pCount * 3)
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 30
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 20
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
        color: 0x00D4B8, size: 0.04, transparent: true, opacity: 0.3, sizeAttenuation: true,
      })))

      const grid = new THREE.GridHelper(40, 40, 0x00D4B8, 0x001818)
      grid.position.y = -4
      const gridMats = Array.isArray(grid.material) ? grid.material : [grid.material]
      gridMats.forEach(m => { m.transparent = true; m.opacity = 0.08 })
      scene.add(grid)

      // Orbit (mouse + touch)
      const orbit = { theta: 0, phi: Math.PI / 2, radius: isMobile ? 13 : 10, dragging: false, lastX: 0, lastY: 0 }
      const getXY = (e) => e.touches ? [e.touches[0].clientX, e.touches[0].clientY] : [e.clientX, e.clientY]
      const onPointerDown = (e) => { orbit.dragging = true; const [x, y] = getXY(e); orbit.lastX = x; orbit.lastY = y }
      const onPointerUp = () => { orbit.dragging = false }
      const onPointerMove = (e) => {
        if (!orbit.dragging) return
        const [x, y] = getXY(e)
        orbit.theta -= (x - orbit.lastX) * 0.008
        orbit.phi = Math.max(0.3, Math.min(Math.PI - 0.3, orbit.phi - (y - orbit.lastY) * 0.006))
        orbit.lastX = x; orbit.lastY = y
      }
      const onWheel = (e) => { orbit.radius = Math.max(5, Math.min(18, orbit.radius + e.deltaY * 0.01)) }

      mount.addEventListener('mousedown', onPointerDown)
      mount.addEventListener('touchstart', onPointerDown, { passive: true })
      window.addEventListener('mouseup', onPointerUp)
      window.addEventListener('touchend', onPointerUp)
      window.addEventListener('mousemove', onPointerMove)
      window.addEventListener('touchmove', onPointerMove, { passive: true })
      mount.addEventListener('wheel', onWheel, { passive: true })

      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      const allCardMeshes = cardGroups.map(g => g.userData.card)
      const onCanvasMouseMove = (e) => {
        if (orbit.dragging) return
        const rect = mount.getBoundingClientRect()
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hits = raycaster.intersectObjects(allCardMeshes)
        if (hits.length && stateRef.current.assembled) {
          const g = cardGroups.find(g => g.userData.card === hits[0].object)
          if (g) { onCardHover(g.userData.id); mount.style.cursor = 'pointer' }
        } else {
          mount.style.cursor = orbit.dragging ? 'grabbing' : 'grab'
        }
      }
      mount.addEventListener('mousemove', onCanvasMouseMove)
      mount.style.cursor = 'grab'

      let animId, t = 0, frameCount = 0
      const animate = () => {
        animId = requestAnimationFrame(animate)
        if (isPausedRef.current) return
        frameCount++
        if (isMobile && frameCount % 2 !== 0) return // throttle on mobile
        t += 0.01
        const { assembled, focusId } = stateRef.current
        const tx = Math.sin(orbit.phi) * Math.sin(orbit.theta) * orbit.radius
        const ty = Math.cos(orbit.phi) * orbit.radius
        const tz = Math.sin(orbit.phi) * Math.cos(orbit.theta) * orbit.radius
        camera.position.lerp(new THREE.Vector3(tx, ty, tz), 0.06)
        camera.lookAt(0, 0, 0)

        cardGroups.forEach((g, i) => {
          const isFocus = focusId === g.userData.id
          if (assembled) {
            const fp = g.userData.assembledPos.clone()
            if (isFocus) fp.z += 1.5
            g.position.lerp(fp, 0.06)
            g.rotation.x += (0 - g.rotation.x) * 0.06
            g.rotation.y += ((isFocus ? 0 : (i - 1) * 0.15) - g.rotation.y) * 0.06
            g.rotation.z += (0 - g.rotation.z) * 0.06
            g.position.y += Math.sin(t * 0.8 + g.userData.floatPhase) * 0.003
          } else {
            g.position.lerp(g.userData.scatterPos, 0.04)
            g.rotation.x += 0.008
            g.rotation.y += 0.012
            g.rotation.z += 0.005
          }
          const targetScale = isFocus && assembled ? 1.12 : 1
          g.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08)
          const targetOp = isFocus && assembled ? 0.5 : assembled ? 0.22 : 0.12
          g.userData.card.material.opacity += (targetOp - g.userData.card.material.opacity) * 0.08
          g.userData.card.material.emissiveIntensity = isFocus && assembled ? 0.15 : 0
          g.userData.card.material.emissive = new THREE.Color(g.userData.color)
          g.userData.sWire.rotation.y = t * 1.5
          g.userData.sWire.rotation.x = t * 0.8
        })

        ptMain.intensity = 3 + Math.sin(t * 1.5) * 0.8
        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        W = mount.clientWidth; H = mount.clientHeight
        if (W === 0 || H === 0) return
        renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      mount._threeCleanup = () => {
        cancelAnimationFrame(animId)
        mount.removeEventListener('mousedown', onPointerDown)
        mount.removeEventListener('touchstart', onPointerDown)
        window.removeEventListener('mouseup', onPointerUp)
        window.removeEventListener('touchend', onPointerUp)
        window.removeEventListener('mousemove', onPointerMove)
        window.removeEventListener('touchmove', onPointerMove)
        mount.removeEventListener('mousemove', onCanvasMouseMove)
        mount.removeEventListener('wheel', onWheel)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      }
    }).catch(() => onLoadError())

    return () => {
      cancelled = true
      const m = mountRef.current
      if (m && m._threeCleanup) { m._threeCleanup(); m._threeCleanup = null }
    }
  }, [onCardHover, onLoadError])

  return <div ref={mountRef} style={{ width: '100%', height: '100%', borderRadius: 24 }} />
}

// ── PROJECT INFO CARD ──
function ProjectInfoCard({ project, visible }) {
  const Icon = project.icon
  return (
    <div style={{
      position: 'absolute', bottom: '2rem', left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
      opacity: visible ? 1 : 0, transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
      pointerEvents: visible ? 'auto' : 'none',
      zIndex: 10, width: 'min(600px, 92%)',
    }}>
      <div style={{
        background: `linear-gradient(135deg, rgba(6,8,16,0.96), ${project.color}18)`,
        border: `1px solid ${project.color}50`,
        borderRadius: 20, padding: '1.25rem 1.5rem',
        backdropFilter: 'blur(20px)',
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${project.color}20`,
        display: 'flex', flexDirection: 'column', gap: '0.65rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: `${project.color}20`, border: `1px solid ${project.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: project.color,
            }}>
              <Icon />
            </div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{project.title}</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', letterSpacing: '0.15em', color: project.color }}>{project.subtitle}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '1.3rem', fontWeight: 700, color: project.color, lineHeight: 1 }}>{project.stat}</div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.45rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)' }}>{project.statLabel}</div>
          </div>
        </div>

        <div style={{ height: 1, background: `linear-gradient(to right, ${project.color}60, transparent)` }} />

        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: 0 }}>{project.desc}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: "'Space Mono',monospace", fontSize: '0.45rem', letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '100px', padding: '0.2rem 0.55rem',
              }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
            <a href={project.liveUrl} style={{
              fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.1em', color: '#000', background: project.color,
              borderRadius: 8, padding: '0.45rem 0.9rem', textDecoration: 'none',
              whiteSpace: 'nowrap', transition: 'transform 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              LIVE <ExternalLinkIcon />
            </a>
            <a href={project.githubUrl} style={{
              fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              <GithubIcon /> GITHUB
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── FALLBACK (no WebGL support) ──
function FallbackCards({ focusId, setFocusId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', overflowY: 'auto', height: '100%' }}>
      {projects.map(p => {
        const Icon = p.icon
        const isFocus = focusId === p.id
        return (
          <div key={p.id} onClick={() => setFocusId(p.id)} style={{
            background: isFocus ? `${p.color}12` : 'rgba(255,255,255,0.02)',
            border: `1px solid ${isFocus ? p.color + '50' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 16, padding: '1.25rem 1.5rem', cursor: 'pointer', transition: 'all 0.25s',
          }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ color: p.color, flexShrink: 0 }}><Icon /></div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{p.title}</div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', letterSpacing: '0.12em', color: p.color }}>{p.subtitle}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontFamily: "'Space Mono',monospace", fontSize: '1rem', fontWeight: 700, color: p.color }}>{p.stat}</div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: '0 0 0.6rem' }}>{p.desc}</p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {p.tags.map(t => (
                <span key={t} style={{
                  fontFamily: "'Space Mono',monospace", fontSize: '0.42rem',
                  color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, padding: '0.18rem 0.5rem',
                }}>{t}</span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── MAIN EXPORT ──
export default function Projects3D() {
  const [assembled, setAssembled] = useState(false)
  const [focusId, setFocusId] = useState(null)
  const [threeLoaded, setThreeLoaded] = useState(false)
  const [threeSupported, setThreeSupported] = useState(true)
  const headRef = useFadeUp(0)
  const sectionRef = useRef(null)

  // 1. Check WebGL + pre-load Three.js
useEffect(() => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) { setTimeout(() => setThreeSupported(false), 0); return }
  } catch {
    setTimeout(() => setThreeSupported(false), 0); return
  }
  loadThree().then(THREE => {
    if (THREE) setThreeLoaded(true)
    else setThreeSupported(false)
  }).catch(() => setThreeSupported(false))
}, [])

  // 2. Auto-assemble on scroll
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting && !assembled) {
          setTimeout(() => { setAssembled(true); setFocusId('farmai') }, 400)
        }
      }),
      { threshold: 0.25 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [assembled])

  const handleCardHover = useCallback((id) => { if (assembled) setFocusId(id) }, [assembled])
  const handleLoadError = useCallback(() => setThreeSupported(false), [])
  const focusProject = projects.find(p => p.id === focusId)

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ padding: '6rem 5vw', background: '#07090f', borderTop: '1px solid rgba(255,255,255,0.07)' }}
    >
      <style>{`
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        .proj-pills { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        @media(max-width:640px){
          #projects { padding: 3.5rem 4vw !important; }
          .proj-viewport { height: 420px !important; }
          .proj-pills button { font-size:0.44rem !important; padding:0.32rem 0.65rem !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        {/* Header */}
        <div ref={headRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div className="section-label">PROJECTS</div>
            <h2 className="section-title">Field<br /><span className="section-muted">deployments.</span></h2>
          </div>
          {threeSupported && (
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', alignSelf: 'flex-end' }}>
              DRAG TO ORBIT · SCROLL TO ZOOM
            </div>
          )}
        </div>

        {/* Viewport */}
        <div className="proj-viewport" style={{
          position: 'relative', height: 580, borderRadius: 24, overflow: 'hidden',
          border: '1px solid rgba(0,212,184,0.12)',
          background: 'radial-gradient(ellipse at center, rgba(0,212,184,0.04) 0%, #060810 70%)',
        }}>

          {/* Loading spinner */}
          {threeSupported && !threeLoaded && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '1rem', zIndex: 20,
            }}>
              <div style={{
                width: 32, height: 32,
                border: '2px solid rgba(0,212,184,0.2)',
                borderTop: '2px solid #00D4B8',
                borderRadius: '50%',
                animation: 'spin 0.9s linear infinite',
              }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', letterSpacing: '0.18em', color: 'rgba(0,212,184,0.6)' }}>
                LOADING SCENE...
              </span>
            </div>
          )}

          {/* 3D canvas */}
          {threeSupported && threeLoaded && (
            <AssemblyCanvas
              focusId={focusId}
              onCardHover={handleCardHover}
              assembled={assembled}
              onLoadError={handleLoadError}
              sectionRef={sectionRef} 
            />
          )}

          {/* Fallback */}
          {!threeSupported && (
            <FallbackCards focusId={focusId} setFocusId={setFocusId} />
          )}

          {/* Project pills */}
          <div className="proj-pills" style={{
            position: 'absolute', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
            opacity: assembled ? 1 : 0,
            transition: 'opacity 0.6s ease',
            pointerEvents: assembled ? 'auto' : 'none',
            zIndex: 5, width: '90%',
          }}>
            {projects.map(p => {
              const Icon = p.icon
              return (
                <button key={p.id}
                  onMouseEnter={() => setFocusId(p.id)}
                  onClick={() => setFocusId(p.id)}
                  style={{
                    fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', letterSpacing: '0.1em',
                    color: focusId === p.id ? '#000' : 'rgba(255,255,255,0.6)',
                    background: focusId === p.id ? p.color : 'rgba(6,8,16,0.8)',
                    border: `1px solid ${focusId === p.id ? p.color : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '100px', padding: '0.4rem 1rem', cursor: 'pointer',
                    transition: 'all 0.25s', backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}>
                  <span style={{ color: focusId === p.id ? '#000' : p.color, display: 'flex' }}>
                    <Icon size={12} />
                  </span>
                  {p.title}
                </button>
              )
            })}
          </div>

          {/* Assembling indicator */}
          {threeSupported && (
            <div style={{
              position: 'absolute', bottom: '1.5rem', right: '1.5rem',
              opacity: !assembled ? 1 : 0,
              transition: 'opacity 0.5s ease',
              pointerEvents: 'none', zIndex: 5,
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4B8', animation: 'blink 1s ease-in-out infinite' }} />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', letterSpacing: '0.18em', color: 'rgba(0,212,184,0.7)' }}>
                ASSEMBLING...
              </span>
            </div>
          )}

          {/* Info card */}
          {focusProject && threeSupported && threeLoaded && (
            <ProjectInfoCard project={focusProject} visible={assembled && !!focusId} />
          )}
        </div>
      </div>
    </section>
  )
}