/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { useFadeUp } from '../hooks/useFadeUp'
import { useVisibilityPause } from '../hooks/useVisibilityPause'

// ── SVG ICONS — no emojis anywhere ──
const Icons = {
  GradCap: ({ size = 28, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Zap: ({ size = 28, color = '#0099ff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Award: ({ size = 28, color = '#00ffaa' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  Rocket: ({ size = 28, color = '#7c6aff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  ),
  Fire: ({ size = 28, color = '#ff6eb4' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
  ),
  Cloud: ({ size = 28, color = '#ff4444' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
    </svg>
  ),
  Gear: ({ size = 28, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  MapPin: ({ size = 16, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  BookOpen: ({ size = 16, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Briefcase: ({ size = 16, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  Globe: ({ size = 16, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Medal: ({ size = 16, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="15" r="6"/><path d="M8.56 2.9A7 7 0 0 1 19 9v4"/><path d="M5 9v4A7 7 0 0 0 9.91 17.4"/><line x1="12" y1="9" x2="12" y2="9.01"/>
    </svg>
  ),
  ArrowLeft: ({ size = 14, color = '#fff' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  ArrowRight: ({ size = 14, color = '#000' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Code: ({ size = 16, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
    </svg>
  ),
  Server: ({ size = 16, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  ),
  CheckCircle: ({ size = 16, color = '#00D4B8' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
}

const milestones = [
  { id:'start',           year:'2021', title:'The Beginning',       desc:'Joined B.Tech CSE at AKTU Lucknow. First lines of code. First "why is this broken". First "I will never stop building."', Icon: Icons.GradCap,  color:'#00D4B8', fact:'Started from zero — AKTU CSE, Lucknow', FactIcon: Icons.MapPin },
  { id:'mern',            year:'2022', title:'Going Full Stack',     desc:'Mastered MERN end-to-end. Built first real-world apps. Discovered that backend architecture is where the real craft lives.', Icon: Icons.Zap,      color:'#0099ff', fact:'React · Node · MongoDB · Express — mastered end-to-end', FactIcon: Icons.Code },
  { id:'cert',            year:'2023', title:'Levelling Up',         desc:'Certified in Web Development via Internshala. Went deep into DSA, system design, and the fundamentals that separate good devs from great ones.', Icon: Icons.Award,    color:'#00ffaa', fact:'Internshala Web Dev Certified · Deep DSA grind', FactIcon: Icons.CheckCircle },
  { id:'velonetics',      year:'2024', title:'First Internship',     desc:'Web Developer Intern at Velonetics. First real client work — shipping features under deadline, handling feedback, building for production users.', Icon: Icons.Rocket,   color:'#7c6aff', fact:'First production client work at Velonetics', FactIcon: Icons.Briefcase },
  { id:'webminix-intern', year:'Oct 2025', title:'SDE Intern',       desc:'Joined Webminix to build Insta Sales — enterprise e-commerce. Built 6+ REST APIs, Redis caching, cut response times by 35%.', Icon: Icons.Fire,     color:'#ff6eb4', fact:'6+ REST APIs · Redis -35% latency · Webminix', FactIcon: Icons.Server },
  { id:'oracle',          year:'2025', title:'Oracle AI Certified',  desc:'Earned Oracle Cloud Infrastructure Generative AI Professional cert. Doubled down on AI — powering FarmAI and Zevora platforms.', Icon: Icons.Cloud,    color:'#ff4444', fact:'Oracle Cloud Infrastructure Gen AI Certified · 2025', FactIcon: Icons.CheckCircle },
  { id:'sde',             year:'2026', title:'SDE @ Webminix',       desc:'Promoted to full Software Development Engineer. Leading backend architecture for an enterprise platform. Still shipping. Not stopping.', Icon: Icons.Gear,     color:'#00D4B8', fact:'Full SDE · Leading backend architecture · Still building', FactIcon: Icons.Gear },
]

const BIO_CHIPS = [
  { Icon: Icons.MapPin,   label: 'Lucknow, India' },
  { Icon: Icons.BookOpen, label: 'AKTU · CSE 2025' },
  { Icon: Icons.Gear,     label: 'SDE @ Webminix' },
  { Icon: Icons.Globe,    label: 'Open to Work' },
  { Icon: Icons.Medal,    label: 'Oracle AI Certified' },
]

// ── LAZY THREE.JS LOADER (singleton) ──
let threePromise = null
const loadThree = () => {
  if (!threePromise) threePromise = import('three').catch(() => null)
  return threePromise
}

// ── AMBIENT CANVAS ──
function AmbientCanvas({ sectionRef }) {
  const { isPausedRef, mountRef } = useVisibilityPause(sectionRef) 
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    // WebGL check
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl')
      if (!gl) { setSupported(false); return }
    } catch { setSupported(false); return }

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
      } catch { setSupported(false); return }

      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5))
      renderer.shadowMap.enabled = false
      mount.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
      camera.position.set(0, 0, 10)

      scene.add(new THREE.AmbientLight(0x001122, 1))
      const pt1 = new THREE.PointLight(0x00D4B8, 2, 30); pt1.position.set(5, 5, 5); scene.add(pt1)
      const pt2 = new THREE.PointLight(0x0055ff, 1.5, 25); pt2.position.set(-6, -3, 4); scene.add(pt2)

      // Fewer gems on mobile
      const gemCount = isMobile ? 8 : 18
      const gems = []
      for (let i = 0; i < gemCount; i++) {
        const size = 0.06 + Math.random() * 0.14
        const geos = [
          new THREE.OctahedronGeometry(size, 0),
          new THREE.TetrahedronGeometry(size, 0),
          new THREE.IcosahedronGeometry(size, 0),
        ]
        const col = [0x00D4B8, 0x0099ff, 0x00ffaa, 0x7c6aff][Math.floor(Math.random() * 4)]
        const mesh = new THREE.Mesh(
          geos[Math.floor(Math.random() * 3)],
          new THREE.MeshStandardMaterial({ color: col, metalness: 0.9, roughness: 0.05, emissive: new THREE.Color(col), emissiveIntensity: 0.2, transparent: true, opacity: 0.55 })
        )
        mesh.position.set((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6 - 3)
        mesh.userData = { rx: (Math.random() - 0.5) * 0.025, ry: (Math.random() - 0.5) * 0.025, initX: mesh.position.x, initY: mesh.position.y, phase: Math.random() * Math.PI * 2 }
        scene.add(mesh); gems.push(mesh)
      }

      // Fewer particles on mobile
      const pCount = isMobile ? 120 : 350
      const pPos = new Float32Array(pCount * 3)
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 22
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 14
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00D4B8, size: 0.05, transparent: true, opacity: 0.22, sizeAttenuation: true })))

      const rings = []
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1.5 + i * 1.2, 0.01, 6, 80),
          new THREE.MeshBasicMaterial({ color: 0x00D4B8, transparent: true, opacity: 0.08 - i * 0.02 })
        )
        ring.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, -4)
        ring.rotation.x = Math.random() * Math.PI; ring.rotation.y = Math.random() * Math.PI
        ring.userData = { rs: (Math.random() - 0.5) * 0.006 }
        scene.add(ring); rings.push(ring)
      }

      const mouse = { x: 0, y: 0 }
      const onMM = e => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMM)

      let animId, t = 0, frameCount = 0
      const animate = () => {
        animId = requestAnimationFrame(animate)
        if (isPausedRef.current) return
        frameCount++
        // Skip every other frame on mobile — halves GPU load
        if (isMobile && frameCount % 2 !== 0) return
        t += 0.008

        camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.03
        camera.position.y += (mouse.y * 0.6 - camera.position.y) * 0.03
        camera.lookAt(0, 0, 0)

        gems.forEach(g => {
          g.rotation.x += g.userData.rx
          g.rotation.y += g.userData.ry
          g.position.y = g.userData.initY + Math.sin(t * 0.7 + g.userData.phase) * 0.3
          g.position.x = g.userData.initX + Math.sin(t * 0.4 + g.userData.phase) * 0.15
        })

        rings.forEach(r => {
          r.rotation.z += r.userData.rs
          r.rotation.x += r.userData.rs * 0.5
        })

        pt1.intensity = 2 + Math.sin(t * 1.2) * 0.6
        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        W = mount.clientWidth; H = mount.clientHeight
        if (W === 0 || H === 0) return
        renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      mount._ambientCleanup = () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMM)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      }
    }).catch(() => setSupported(false))

    return () => {
      cancelled = true
      const m = mountRef.current
      if (m && m._ambientCleanup) { m._ambientCleanup(); m._ambientCleanup = null }
    }
  }, [])

  // If not supported, render nothing — section still works fine without ambient bg
  if (!supported) return null

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
}

// ── GLOWING ICON BOX ──
function IconBox({ Icon, color, size = 72 }) {
  return (
    <div style={{
      width: size, height: size,
      background: `${color}15`, border: `1px solid ${color}40`,
      borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 0 28px ${color}20, inset 0 0 20px ${color}08`,
      position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)', borderRadius: '18px 18px 0 0' }} />
      <Icon size={size * 0.42} color={color} />
    </div>
  )
}

export default function About3D() {
  const sectionRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(6)
  const [animating, setAnimating]  = useState(false)
  const headRef = useFadeUp(0)
  const bodyRef = useFadeUp(0.1)
  const active  = milestones[activeIdx]

  const goTo = (idx) => {
    if (idx === activeIdx || animating) return
    setAnimating(true)
    setTimeout(() => { setActiveIdx(idx); setAnimating(false) }, 220)
  }

  return (
    <section id="about" ref={sectionRef} style={{ position: 'relative', padding: '6rem 5vw 5rem', background: '#060810', borderTop: '1px solid rgba(255,255,255,0.07)', minHeight: '100vh', overflow: 'hidden' }}>
        <AmbientCanvas sectionRef={sectionRef} /> 

      <style>{`
        div::-webkit-scrollbar { display: none; }
        @keyframes about-spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }

        .about-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        @media (max-width: 768px) {
          #about { padding: 3.5rem 4vw 3rem !important; }
          .about-content-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .about-content-grid > div:last-child {
            display: none !important;
          }
        }
      `}</style>

      {/* Ambient 3D background — lazy loaded, gracefully skipped if no WebGL */}

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div ref={headRef} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>ABOUT</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em', color: '#fff', marginBottom: '1rem' }}>
            The story<br />
            <span style={{ background: 'linear-gradient(90deg,#00D4B8,#0099ff)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>so far.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
            Software Developer Engineer — early-career engineer shipping enterprise-level code.
          </p>
        </div>

        {/* Bio chips */}
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {BIO_CHIPS.map(({ Icon, label }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '100px', padding: '0.45rem 1rem', backdropFilter: 'blur(8px)' }}>
              <Icon size={14} color="#00D4B8" />
              <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Main card */}
        <div ref={bodyRef} style={{ background: 'rgba(6,8,16,0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, backdropFilter: 'blur(24px)', overflow: 'hidden' }}>

          {/* Timeline tab strip */}
          <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none', position: 'relative' }}>
            {milestones.map((ms, i) => {
              const isActive = i === activeIdx
              return (
                <button key={ms.id} onClick={() => goTo(i)}
                  style={{ flexShrink: 0, padding: '1rem 1.25rem', background: isActive ? `${ms.color}12` : 'transparent', border: 'none', borderBottom: `2px solid ${isActive ? ms.color : 'transparent'}`, cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', position: 'relative' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ opacity: isActive ? 1 : 0.45, transition: 'opacity 0.25s' }}>
                    <ms.Icon size={20} color={isActive ? ms.color : '#9090A0'} />
                  </div>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.44rem', letterSpacing: '0.1em', color: isActive ? ms.color : '#9090A0', transition: 'color 0.25s', whiteSpace: 'nowrap' }}>{ms.year}</span>
                  {isActive && <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: ms.color, boxShadow: `0 0 10px ${ms.color}` }} />}
                </button>
              )
            })}
          </div>

          {/* Content grid */}
          <div
            className="about-content-grid"
            style={{ padding: '2.5rem 3rem', opacity: animating ? 0 : 1, transform: animating ? 'translateY(8px)' : 'translateY(0)', transition: 'opacity 0.22s ease, transform 0.22s ease' }}
          >
            {/* Left — story */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: `${active.color}15`, border: `1px solid ${active.color}40`, borderRadius: '100px', padding: '0.35rem 1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: active.color, boxShadow: `0 0 8px ${active.color}` }} />
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.55rem', letterSpacing: '0.15em', color: active.color }}>{active.year}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem' }}>
                <IconBox Icon={active.Icon} color={active.color} size={52} />
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.4rem,2.5vw,2.1rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{active.title}</h3>
              </div>

              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '1.75rem' }}>{active.desc}</p>

              {/* Nav */}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button onClick={() => goTo(Math.max(0, activeIdx - 1))} disabled={activeIdx === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Space Mono',monospace", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', color: activeIdx === 0 ? 'rgba(255,255,255,0.2)' : '#fff', background: 'transparent', border: `1px solid ${activeIdx === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)'}`, borderRadius: 8, padding: '0.6rem 1rem', cursor: activeIdx === 0 ? 'default' : 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { if (activeIdx > 0) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = activeIdx === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'transparent' }}>
                  <Icons.ArrowLeft size={13} color={activeIdx === 0 ? 'rgba(255,255,255,0.2)' : '#fff'} /> PREV
                </button>

                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{activeIdx + 1} / {milestones.length}</span>

                <button onClick={() => goTo(Math.min(milestones.length - 1, activeIdx + 1))} disabled={activeIdx === milestones.length - 1}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Space Mono',monospace", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', color: activeIdx === milestones.length - 1 ? 'rgba(255,255,255,0.2)' : '#000', background: activeIdx === milestones.length - 1 ? 'transparent' : active.color, border: `1px solid ${activeIdx === milestones.length - 1 ? 'rgba(255,255,255,0.08)' : active.color}`, borderRadius: 8, padding: '0.6rem 1rem', cursor: activeIdx === milestones.length - 1 ? 'default' : 'pointer', transition: 'all 0.25s' }}
                  onMouseEnter={e => { if (activeIdx < milestones.length - 1) { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 0 20px ${active.color}50` } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}>
                  NEXT <Icons.ArrowRight size={13} color={activeIdx === milestones.length - 1 ? 'rgba(255,255,255,0.2)' : '#000'} />
                </button>
              </div>
            </div>

            {/* Right — visual card (hidden on mobile via CSS) */}
            <div style={{ background: `${active.color}08`, border: `1px solid ${active.color}25`, borderRadius: 20, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <IconBox Icon={active.Icon} color={active.color} size={72} />

              <div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.46rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>JOURNEY PROGRESS</div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {milestones.map((ms, i) => (
                    <div key={ms.id} onClick={() => goTo(i)} style={{ height: i === activeIdx ? 8 : 6, width: i === activeIdx ? 28 : 8, borderRadius: 4, background: i <= activeIdx ? ms.color : 'rgba(255,255,255,0.1)', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: i === activeIdx ? `0 0 10px ${ms.color}` : 'none' }} />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.9rem', background: `${active.color}0a`, border: `1px solid ${active.color}20`, borderRadius: 12 }}>
                <active.FactIcon size={15} color={active.color} />
                <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{active.fact}</span>
              </div>

              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.46rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', borderTop: `1px solid ${active.color}20`, paddingTop: '1rem' }}>
                MILESTONE {activeIdx + 1} OF {milestones.length} · {active.year}
              </div>
            </div>
          </div>

          {/* Bottom chip strip */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '0.85rem 2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {milestones.map((ms, i) => (
              <div key={ms.id} onClick={() => goTo(i)}
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', background: i === activeIdx ? `${ms.color}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${i === activeIdx ? ms.color + '50' : 'rgba(255,255,255,0.07)'}`, borderRadius: '100px', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (i !== activeIdx) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { if (i !== activeIdx) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}>
                <ms.Icon size={12} color={i === activeIdx ? ms.color : '#9090A0'} />
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.44rem', letterSpacing: '0.08em', color: i === activeIdx ? ms.color : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{ms.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}