import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFadeUp } from '../hooks/useFadeUp'

const certs = [
  { id:'oracle', name:'Oracle Cloud Infrastructure 2025', sub:'Certified Generative AI Professional', issuer:'Oracle', year:'2025', color:'#f80000', hexColor:0xff3333, desc:'Validates expertise in AI, ML, and generative AI services on Oracle Cloud Infrastructure.', viewUrl:'#' },
  { id:'mern', name:'MERN Stack Development', sub:'Full-Stack Web Development', issuer:'ShapeMySkill', year:'2024', color:'#00D4B8', hexColor:0x00D4B8, desc:'Comprehensive certification covering MongoDB, Express, React, and Node for full-stack apps.', viewUrl:'#' },
  { id:'web', name:'Web Development Training', sub:'Frontend & Backend Fundamentals', issuer:'Internshala', year:'2023', color:'#0099ff', hexColor:0x0099ff, desc:'Structured training in HTML, CSS, JavaScript, and core web development principles.', viewUrl:'#' },
]

function ThreeCertsCanvas({ activeId, onSelect }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const W = mount.clientWidth, H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W/H, 0.1, 100)
    camera.position.set(0, 0, 6)

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    certs.forEach((c,i) => {
      const pt = new THREE.PointLight(c.hexColor, 1.5, 12); pt.position.set((i-1)*3, 2, 2); scene.add(pt)
    })

    // Medal meshes — cylinders as coins/medals
    const medalMeshes = []
    certs.forEach((cert, i) => {
      const angle = (i/certs.length)*Math.PI*2
      const group = new THREE.Group()
      const radius = 1.8
      group.position.set(Math.cos(angle)*radius, Math.sin(angle)*0.5, Math.sin(angle)*radius*0.4)

      // Medal coin shape
      const medalGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32)
      const medalMat = new THREE.MeshStandardMaterial({ color: cert.hexColor, metalness:0.95, roughness:0.05 })
      const medal = new THREE.Mesh(medalGeo, medalMat)
      medal.rotation.x = Math.PI/2
      group.add(medal)

      // Medal rim
      const rimGeo = new THREE.TorusGeometry(0.5, 0.04, 8, 32)
      const rimMat = new THREE.MeshStandardMaterial({ color: cert.hexColor, metalness:1, roughness:0.0 })
      const rim = new THREE.Mesh(rimGeo, rimMat)
      group.add(rim)

      // Star on medal
      const starGeo = new THREE.OctahedronGeometry(0.15, 0)
      const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness:0.9, roughness:0.1 })
      const star = new THREE.Mesh(starGeo, starMat)
      star.position.z = 0.1
      group.add(star)

      // Ribbon string (cylinder going up)
      const ribbonGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6)
      const ribbonMat = new THREE.MeshStandardMaterial({ color: cert.hexColor, transparent:true, opacity:0.6 })
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat)
      ribbon.position.y = 0.55
      group.add(ribbon)

      group.userData = { certId: cert.id, baseAngle: angle, radius, initY: group.position.y, index: i, color: cert.hexColor }
      scene.add(group)
      medalMeshes.push({ group, medal, id: cert.id })
    })

    // Background particles + floating gems
    const pCount = 500
    const pPos = new Float32Array(pCount*3)
    for(let i=0;i<pCount;i++){pPos[i*3]=(Math.random()-0.5)*12;pPos[i*3+1]=(Math.random()-0.5)*8;pPos[i*3+2]=(Math.random()-0.5)*5-3}
    const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3))
    scene.add(new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x00D4B8,size:0.03,transparent:true,opacity:0.3})))

    // Floating diamond gems
    for(let i=0;i<6;i++){
      const gem=new THREE.Mesh(new THREE.OctahedronGeometry(0.07,0),new THREE.MeshStandardMaterial({color:certs[i%3].hexColor,metalness:0.95,roughness:0.05,transparent:true,opacity:0.7}))
      gem.position.set((Math.random()-0.5)*7,(Math.random()-0.5)*5,(Math.random()-0.5)*3-2)
      gem.userData={rotS:(Math.random()-0.5)*0.05,floatY:gem.position.y,phase:Math.random()*Math.PI*2}
      scene.add(gem)
    }

    // Orbit ring
    const outerRing=new THREE.Mesh(new THREE.TorusGeometry(2.2,0.015,8,80),new THREE.MeshBasicMaterial({color:0x00D4B8,transparent:true,opacity:0.15}))
    outerRing.rotation.x=Math.PI/3; scene.add(outerRing)

    // Click
    const raycaster=new THREE.Raycaster(); const pointer=new THREE.Vector2()
    const clickMeshes=medalMeshes.map(m=>m.medal)
    const onClick=e=>{
      const rect=mount.getBoundingClientRect()
      pointer.x=((e.clientX-rect.left)/rect.width)*2-1
      pointer.y=-((e.clientY-rect.top)/rect.height)*2+1
      raycaster.setFromCamera(pointer,camera)
      const hits=raycaster.intersectObjects(clickMeshes)
      if(hits.length){const hit=medalMeshes.find(m=>m.medal===hits[0].object);if(hit)onSelect(hit.id)}
    }
    mount.addEventListener('click',onClick)

    const mouse={x:0,y:0}
    const onMove=e=>{mouse.x=(e.clientX/window.innerWidth-0.5)*2;mouse.y=-(e.clientY/window.innerHeight-0.5)*2}
    window.addEventListener('mousemove',onMove)

    const gems=scene.children.filter(c=>c.userData.rotS!==undefined)
    let animId,t=0

    const animate=()=>{
      animId=requestAnimationFrame(animate); t+=0.01

      medalMeshes.forEach(({group,medal,id})=>{
        const isActive=activeId===id
        const angle=group.userData.baseAngle+t*0.25
        group.position.x=Math.cos(angle)*group.userData.radius
        group.position.z=Math.sin(angle)*group.userData.radius*0.4
        group.position.y=group.userData.initY+Math.sin(t+group.userData.index*1.5)*0.2
        group.rotation.y+=0.02
        const targetScale=isActive?1.5:1
        group.scale.lerp(new THREE.Vector3(targetScale,targetScale,targetScale),0.08)
        medal.material.emissive=isActive?new THREE.Color(group.userData.color):new THREE.Color(0)
        medal.material.emissiveIntensity=isActive?0.4:0
      })

      gems.forEach(g=>{g.rotation.x+=g.userData.rotS;g.rotation.y+=g.userData.rotS*1.3;g.position.y=g.userData.floatY+Math.sin(t+g.userData.phase)*0.15})
      outerRing.rotation.z=t*0.08

      camera.position.x+=(mouse.x*1.2-camera.position.x)*0.04
      camera.position.y+=(mouse.y*0.7-camera.position.y)*0.04
      camera.lookAt(0,0,0)

      renderer.render(scene,camera)
    }
    animate()

    const onResize=()=>{const w=mount.clientWidth,h=mount.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()}
    window.addEventListener('resize',onResize)

    return()=>{
      cancelAnimationFrame(animId);window.removeEventListener('mousemove',onMove)
      window.removeEventListener('resize',onResize);mount.removeEventListener('click',onClick)
      renderer.dispose();if(mount.contains(renderer.domElement))mount.removeChild(renderer.domElement)
    }
  },[activeId,onSelect])

  return <div ref={mountRef} style={{width:'100%',height:'100%'}} />
}

export default function Certifications3D() {
  const [activeId, setActiveId] = useState('oracle')
  const headRef = useFadeUp(0)
  // const active = certs.find(c => c.id === activeId)

  return (
    <section id="certs" style={{ padding:'6rem 5vw', background:'#060810', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div ref={headRef}>
          <div className="section-label">CERTIFICATIONS</div>
          <h2 className="section-title">Verified<br /><span className="section-muted">credentials.</span></h2>
          <p style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', color:'rgba(255,255,255,0.35)', marginTop:'0.5rem' }}>Click a 3D medal to reveal details</p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'3rem', marginTop:'3rem', alignItems:'center' }}>

          <div style={{ height:380, borderRadius:20, overflow:'hidden', border:'1px solid rgba(0,212,184,0.12)', background:'rgba(0,0,0,0.3)' }}>
            <ThreeCertsCanvas activeId={activeId} onSelect={setActiveId} />
          </div>

          <div>
            {certs.map(cert => (
              <div key={cert.id} onClick={() => setActiveId(cert.id)}
                style={{ background:activeId===cert.id?`${cert.color}10`:'rgba(255,255,255,0.03)', border:`1px solid ${activeId===cert.id?cert.color+'50':'rgba(255,255,255,0.07)'}`, borderRadius:16, padding:'1.4rem', cursor:'pointer', transition:'all 0.3s', marginBottom:'0.75rem', transform:activeId===cert.id?'translateX(4px)':'none' }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${cert.color}18`, border:`1px solid ${cert.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>🏅</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'0.9rem', fontWeight:700, color:'#fff', marginBottom:'0.2rem' }}>{cert.name}</div>
                    <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.5rem', letterSpacing:'0.08em', color:'rgba(255,255,255,0.45)', marginBottom:'0.5rem' }}>{cert.sub}</div>
                    <div style={{ display:'flex', gap:'0.5rem' }}>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.5rem', color:cert.color, background:`${cert.color}15`, border:`1px solid ${cert.color}30`, borderRadius:'100px', padding:'0.2rem 0.6rem' }}>{cert.issuer}</span>
                      <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.48rem', color:'#9090A0', padding:'0.2rem 0' }}>{cert.year}</span>
                    </div>
                    {activeId===cert.id && (
                      <div style={{ marginTop:'0.75rem' }}>
                        <p style={{ fontSize:'0.88rem', color:'rgba(255,255,255,0.55)', lineHeight:1.65, marginBottom:'0.75rem' }}>{cert.desc}</p>
                        <a href={cert.viewUrl} style={{ fontFamily:"'Space Mono',monospace", fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.1em', color:'#000', background:cert.color, borderRadius:8, padding:'0.5rem 1rem', textDecoration:'none', display:'inline-block' }}>VIEW CERT ↗</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}