/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { useFadeUp } from '../hooks/useFadeUp'
import { useVisibilityPause } from '../hooks/useVisibilityPause'

// ── SVG ICONS (replacing emojis in skillGroups) ──
const CodeIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
)
const FrameworkIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="4"/>
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/>
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/>
    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
  </svg>
)
const DatabaseIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
)
const ToolsIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)
const BrainIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2z"/>
  </svg>
)

const skillGroups = [
  {
    id: 0, label: 'LANGUAGES',  color: '#00D4B8', hex: 0x00D4B8,
    Icon: CodeIcon, file: 'languages.js',
    skills: ['JavaScript ES6+', 'Java', 'SQL', 'HTML5', 'CSS3'],
    code: `const dev = {\n  lang: ["JS","Java","SQL"],\n  loves: "clean code"\n}`,
  },
  {
    id: 1, label: 'FRAMEWORKS', color: '#0099ff', hex: 0x0099ff,
    Icon: FrameworkIcon, file: 'frameworks.jsx',
    skills: ['Node.js', 'Express.js', 'React.js', 'Three.js', 'Tailwind CSS', 'Bootstrap'],
    code: `app.use(express.json())\nRouter.get("/api", handler)\n// React + Tailwind UI`,
  },
  {
    id: 2, label: 'DATABASES',  color: '#00ffaa', hex: 0x00ffaa,
    Icon: DatabaseIcon, file: 'database.db',
    skills: ['MongoDB', 'Redis', 'SQL', 'Firebase'],
    code: `db.collection.find({})\nawait redis.set(key, val)\nSELECT * FROM users`,
  },
  {
    id: 3, label: 'TOOLS',      color: '#7c6aff', hex: 0x7c6aff,
    Icon: ToolsIcon, file: 'devops.yml',
    skills: ['Git / GitHub', 'Swagger', 'Postman', 'Vercel', 'GCP', 'JWT', 'Joi'],
    code: `git commit -m "feat: api"\ngit push origin main\n// Deploy to Vercel`,
  },
  {
    id: 4, label: 'CONCEPTS',   color: '#ff6eb4', hex: 0xff6eb4,
    Icon: BrainIcon, file: 'architecture.md',
    skills: ['DSA', 'OOP', 'DBMS', 'SDLC', 'WebGL', 'OS', 'Networks'],
    code: `class Service extends Base {\n  constructor(repo) {...}\n  // Clean Architecture`,
  },
]

// ── LAZY THREE.JS LOADER (singleton) ──
let threePromise = null
const loadThree = () => {
  if (!threePromise) threePromise = import('three').catch(() => null)
  return threePromise
}

// ── CIRCUIT BOARD 3D BACKGROUND ──
function CircuitCanvas({ sectionRef }) {
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
      const pt2 = new THREE.PointLight(0x0055ff, 1.5, 25); pt2.position.set(-6, -4, 3); scene.add(pt2)

      // Skip grid lines on mobile — too many draw calls
      if (!isMobile) {
        const gridMat = new THREE.LineBasicMaterial({ color: 0x00D4B8, transparent: true, opacity: 0.07 })
        for (let x = -12; x <= 12; x += 1.5) {
          const pts = [new THREE.Vector3(x, -8, -3), new THREE.Vector3(x, 8, -3)]
          scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
        }
        for (let y = -8; y <= 8; y += 1.5) {
          const pts = [new THREE.Vector3(-12, y, -3), new THREE.Vector3(12, y, -3)]
          scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
        }
      }

      const traceMat = new THREE.LineBasicMaterial({ color: 0x00D4B8, transparent: true, opacity: 0.18 })
      const traces = [
        [[-10,2,-2],[-5,2,-2],[-5,0,-2],[-2,0,-2]],
        [[10,-1,-2],[6,-1,-2],[6,3,-2],[3,3,-2]],
        [[-8,-3,-2],[-3,-3,-2],[-3,-5,-2],[2,-5,-2]],
        [[7,4,-2],[4,4,-2],[4,1,-2],[1,1,-2]],
        [[-6,5,-2],[-1,5,-2],[-1,2,-2],[2,2,-2]],
      ]
      // Fewer traces on mobile
      const activeTraces = isMobile ? traces.slice(0, 2) : traces
      activeTraces.forEach(trace => {
        const pts = trace.map(([x,y,z]) => new THREE.Vector3(x,y,z))
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), traceMat))
      })

      const nodeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.04)
      const positions = [[-5,2],[-5,0],[-2,0],[6,-1],[6,3],[3,3],[-3,-3],[2,-5],[-1,5],[-1,2],[4,4],[4,1]]
      const activePositions = isMobile ? positions.slice(0, 5) : positions
      activePositions.forEach(([x,y]) => {
        const col = Math.random() > 0.5 ? 0x00D4B8 : 0x0099ff
        const node = new THREE.Mesh(nodeGeo, new THREE.MeshStandardMaterial({
          color: col, metalness: 1, roughness: 0,
          emissive: new THREE.Color(col), emissiveIntensity: 0.4,
        }))
        node.position.set(x, y, -2)
        node.userData = { phase: Math.random() * Math.PI * 2 }
        scene.add(node)
      })

      const pulses = activeTraces.map(trace => {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0x00D4B8, transparent: true, opacity: 0.9 })
        )
        sphere.userData = { trace: trace.map(([x,y,z]) => new THREE.Vector3(x,y,z)), t: Math.random(), speed: 0.003 + Math.random() * 0.004 }
        scene.add(sphere)
        return sphere
      })

      // Fewer chips on mobile
      const chips = []
      const chipCount = isMobile ? 3 : 8
      for (let i = 0; i < chipCount; i++) {
        const w = 0.3 + Math.random() * 0.3, h = 0.2 + Math.random() * 0.15
        const chip = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, 0.06),
          new THREE.MeshStandardMaterial({ color: 0x0a1628, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0.7 })
        )
        if (!isMobile) {
          const legMat = new THREE.LineBasicMaterial({ color: 0x00D4B8, transparent: true, opacity: 0.4 })
          for (let l = 0; l < 4; l++) {
            const lpts = [new THREE.Vector3(-w/2 + l*(w/3), h/2, 0.03), new THREE.Vector3(-w/2 + l*(w/3), h/2+0.1, 0.03)]
            chip.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(lpts), legMat))
          }
        }
        chip.position.set((Math.random()-0.5)*16, (Math.random()-0.5)*9, -2.5+Math.random()*0.5)
        chip.rotation.z = (Math.random()-0.5)*0.3
        chip.userData = { initY: chip.position.y, phase: Math.random()*Math.PI*2, rx: (Math.random()-0.5)*0.008 }
        scene.add(chip); chips.push(chip)
      }

      // Fewer particles on mobile
      const pCount = isMobile ? 80 : 250
      const pPos = new Float32Array(pCount * 3)
      for (let i = 0; i < pCount; i++) {
        pPos[i*3] = (Math.random()-0.5)*20
        pPos[i*3+1] = (Math.random()-0.5)*12
        pPos[i*3+2] = (Math.random()-0.5)*4-3
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00D4B8, size: 0.04, transparent: true, opacity: 0.2, sizeAttenuation: true })))

      const mouse = { x: 0, y: 0 }
      const onMM = e => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMM)

      const icNodes = scene.children.filter(c => c.geometry?.type === 'BoxGeometry' && c.userData.phase !== undefined && !c.userData.initY)

      let animId, t = 0, frameCount = 0
      const animate = () => {
        animId = requestAnimationFrame(animate)
        if (isPausedRef.current) return
        frameCount++
        if (isMobile && frameCount % 2 !== 0) return // throttle on mobile
        t += 0.008

        pulses.forEach(p => {
          p.userData.t += p.userData.speed
          if (p.userData.t > 1) p.userData.t = 0
          const tr = p.userData.trace
          const seg = (tr.length - 1) * p.userData.t
          const si = Math.floor(seg), sf = seg - si
          if (tr[si] && tr[si+1]) p.position.lerpVectors(tr[si], tr[si+1], sf)
        })

        icNodes.forEach(n => { n.material.emissiveIntensity = 0.3 + Math.sin(t*2 + n.userData.phase) * 0.25 })
        chips.forEach(c => {
          c.position.y = c.userData.initY + Math.sin(t*0.6 + c.userData.phase) * 0.12
          c.rotation.z += c.userData.rx
        })

        camera.position.x += (mouse.x * 1 - camera.position.x) * 0.03
        camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.03
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        W = mount.clientWidth; H = mount.clientHeight
        if (W === 0 || H === 0) return
        renderer.setSize(W, H); camera.aspect = W / H; camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      mount._circuitCleanup = () => {
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
      if (m && m._circuitCleanup) { m._circuitCleanup(); m._circuitCleanup = null }
    }
  }, [])

  if (!supported) return null
  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
}

// ── TYPING ANIMATION HOOK ──
function useTyping(text, active, speed = 38) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed(''); setDone(false)
    if (!active) return
    let i = 0
    const iv = setInterval(() => {
      setDisplayed(text.slice(0, i+1))
      i++
      if (i >= text.length) { clearInterval(iv); setDone(true) }
    }, speed)
    return () => clearInterval(iv)
  }, [text, active, speed])
  return { displayed, done }
}

// ── SKILL PILL ──
function Pill({ skill, color }) {
  const [hov, setHov] = useState(false)
  return (
    <span onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', letterSpacing: '0.07em',
        color: hov ? color : 'rgba(255,255,255,0.75)',
        background: hov ? `${color}18` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hov ? color+'55' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '100px', padding: '0.3rem 0.75rem',
        transition: 'all 0.2s', transform: hov ? 'translateY(-2px)' : 'none',
        display: 'inline-block', cursor: 'default',
      }}>{skill}</span>
  )
}

// ── IDE FILE TAB ──
function FileTab({ grp, active, onClick }) {
  const Icon = grp.Icon
  return (
    <button onClick={onClick}
      style={{
        fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', letterSpacing: '0.08em',
        color: active ? grp.color : 'rgba(255,255,255,0.4)',
        background: active ? `${grp.color}12` : 'transparent',
        border: 'none', borderBottom: `2px solid ${active ? grp.color : 'transparent'}`,
        padding: '0.6rem 1rem', cursor: 'pointer', transition: 'all 0.2s',
        whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.4rem',
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
    >
      <Icon size={13} color={active ? grp.color : 'rgba(255,255,255,0.4)'} />
      {grp.file}
    </button>
  )
}

export default function TechStack3D() {
  const [activeId, setActiveId] = useState(0)
  const sectionRef = useRef(null)
  const headRef = useFadeUp(0)
  const active = skillGroups[activeId]
  const { displayed } = useTyping(active.code, true, 30)
  const ActiveIcon = active.Icon

  return (
    <section id="skills" ref={sectionRef} style={{
      padding: '5rem 5vw', background: '#07090f',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        div::-webkit-scrollbar { display: none; }

        .skills-ide-body {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          min-height: 320px;
        }

        @media (max-width: 640px) {
          #skills { padding: 3.5rem 4vw !important; }
          .skills-ide-body {
            grid-template-columns: 1fr !important;
          }
          .skills-code-pane {
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.06) !important;
            max-height: 160px !important;
          }
        }
      `}</style>

      {/* 3D circuit background — lazy, gracefully skipped if no WebGL */}
      <CircuitCanvas sectionRef={sectionRef}/>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div ref={headRef} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>TECH STACK</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Tools of<br /><span className="section-muted">precision.</span>
          </h2>
        </div>

        {/* IDE WINDOW */}
        <div style={{
          background: 'rgba(6,8,16,0.88)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}>

          {/* Window chrome */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', marginLeft: '0.75rem', letterSpacing: '0.1em' }}>
              priya-portfolio / src / skills /
            </span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', color: active.color, letterSpacing: '0.1em' }}>
              {active.file}
            </span>
          </div>

          {/* File tabs */}
          <div style={{
            display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.2)',
          }}>
            {skillGroups.map(g => (
              <FileTab key={g.id} grp={g} active={activeId === g.id} onClick={() => setActiveId(g.id)} />
            ))}
          </div>

          {/* IDE BODY */}
          <div className="skills-ide-body">

            {/* Left — code editor pane */}
            <div className="skills-code-pane" style={{
              borderRight: '1px solid rgba(255,255,255,0.06)',
              padding: '1.25rem',
              background: 'rgba(0,0,0,0.15)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.85, userSelect: 'none', textAlign: 'right', minWidth: 16 }}>
                  {active.code.split('\n').map((_, i) => <div key={i}>{i+1}</div>)}
                </div>
                <pre style={{
                  fontFamily: "'Space Mono',monospace", fontSize: '0.52rem',
                  color: 'rgba(255,255,255,0.75)', lineHeight: 1.85,
                  margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1,
                }}>
                  <span style={{ color: active.color }}>{displayed}</span>
                  <span style={{ animation: 'blink 1s step-end infinite', color: active.color }}>▋</span>
                </pre>
              </div>

              {/* Status bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                background: `${active.color}10`,
                padding: '0.3rem 1rem',
                display: 'flex', gap: '1rem', alignItems: 'center',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: active.color, boxShadow: `0 0 6px ${active.color}` }} />
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.44rem', color: active.color, letterSpacing: '0.1em' }}>
                  {active.label} · {active.skills.length} ITEMS
                </span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.44rem', color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>
                  UTF-8 · LF
                </span>
              </div>
            </div>

            {/* Right — skills panel */}
            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Category header with SVG icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${active.color}18`, border: `1px solid ${active.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active.color, flexShrink: 0,
                }}>
                  <ActiveIcon size={18} color={active.color} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', color: active.color }}>
                    {active.label}
                  </div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.46rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginTop: 2 }}>
                    {active.skills.length} technologies
                  </div>
                </div>
              </div>

              {/* Skill pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {active.skills.map(s => <Pill key={s} skill={s} color={active.color} />)}
              </div>

              {/* Mini progress bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                {active.skills.slice(0, 3).map((s, i) => {
                  const widths = [92, 87, 83]
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.44rem', color: 'rgba(255,255,255,0.4)', minWidth: 80, letterSpacing: '0.05em' }}>{s}</span>
                      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          background: `linear-gradient(to right,${active.color},${active.color}88)`,
                          width: `${widths[i]}%`,
                          transition: 'width 0.8s ease',
                          boxShadow: `0 0 6px ${active.color}60`,
                        }} />
                      </div>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.44rem', color: active.color }}>{widths[i]}%</span>
                    </div>
                  )
                })}
              </div>

              {/* Category switcher pills — SVG icons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {skillGroups.map(g => {
                  const GIcon = g.Icon
                  return (
                    <button key={g.id} onClick={() => setActiveId(g.id)}
                      style={{
                        fontFamily: "'Space Mono',monospace", fontSize: '0.44rem', letterSpacing: '0.08em',
                        color: activeId === g.id ? '#000' : 'rgba(255,255,255,0.45)',
                        background: activeId === g.id ? g.color : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${activeId === g.id ? g.color : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '100px', padding: '0.3rem 0.7rem', cursor: 'pointer', transition: 'all 0.22s',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                      }}
                      onMouseEnter={e => { if (activeId !== g.id) { e.currentTarget.style.background = `${g.color}15`; e.currentTarget.style.color = g.color; e.currentTarget.style.borderColor = `${g.color}50` } }}
                      onMouseLeave={e => { if (activeId !== g.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' } }}
                    >
                      <GIcon size={10} color={activeId === g.id ? '#000' : 'rgba(255,255,255,0.45)'} />
                      {g.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}