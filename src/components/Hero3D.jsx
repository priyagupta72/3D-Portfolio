/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
// import { useFadeUp } from "../hooks/useFadeUp";
import { useVisibilityPause } from '../hooks/useVisibilityPause'

const TECH_TAGS = [
  "Node.js",
  "React.js",
  "MongoDB",
  "Redis",
  "Express",
  "JWT",
  "REST API",
  "Swagger",
  "Firebase",
  "Git",
  "JavaScript",
  "Tailwind",
  "Docker",
  "GCP",
  "Joi",
  "TypeScript",
  "MERN",
  "OOP",
  "DSA",
  "SQL",
];

const TRAFFIC_LIGHTS = [
  { col: 0xff5f57, x: -1.7 },
  { col: 0xfebc2e, x: -1.5 },
  { col: 0x28c840, x: -1.3 },
];

const CODE_LINES = [
  { text: "const dev = new Developer({", color: 0x00d4b8, y: 0.7 },
  { text: "  name: 'Priya Gupta',", color: 0x00ffaa, y: 0.38 },
  { text: "  role: 'SDE @ Webminix',", color: 0x00ffaa, y: 0.06 },
  { text: "  stack: ['MERN','Redis'],", color: 0x0099ff, y: -0.26 },
  { text: "  deployed: true,", color: 0x7c6aff, y: -0.58 },
  { text: "})", color: 0x00d4b8, y: -0.9 },
];

const BRACKETS = [
  { sym: "{ }", col: "#00D4B8" },
  { sym: "</>", col: "#0099ff" },
  { sym: "[ ]", col: "#00ffaa" },
  { sym: "( )", col: "#7c6aff" },
  { sym: "=>", col: "#ff6eb4" },
  { sym: "||", col: "#00D4B8" },
  { sym: "&&", col: "#0099ff" },
  { sym: "++", col: "#00ffaa" },
];

const TAG_COLORS = ["#00D4B8", "#0099ff", "#00ffaa", "#7c6aff", "#ff6eb4"];
const TAG_RINGS = [
  { radius: 3.2, tilt: 0.35, speed: 0.22 },
  { radius: 4.1, tilt: 0.65, speed: 0.15 },
  { radius: 5.2, tilt: 0.95, speed: 0.1 },
];

// ── LAZY THREE.JS LOADER (singleton — shared across all components) ──
let threePromise = null;
const loadThree = () => {
  if (!threePromise) threePromise = import("three").catch(() => null);
  return threePromise;
};

function makeSprite(THREE, canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    opacity: 0,
  });
  return new THREE.Sprite(mat);
}

// ── HERO CANVAS (3D) ──
function HeroCanvas({ onReady, sectionRef }) {
  const { isPausedRef, mountRef } = useVisibilityPause(sectionRef)

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let cancelled = false;
    const isMobile = window.innerWidth < 768;

    loadThree()
      .then((THREE) => {
        if (!THREE || cancelled) return;

        let W = mount.clientWidth;
        let H = mount.clientHeight;
        if (W === 0 || H === 0) return;

        let renderer;
        try {
          renderer = new THREE.WebGLRenderer({
            antialias: !isMobile,
            alpha: true,
            powerPreference: "low-power",
          });
        } catch {
          return; // WebGL failed — parent already shows fallback
        }

        renderer.setSize(W, H);
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio, isMobile ? 1 : 2),
        );
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = false;
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
        camera.position.set(0, 0, 5);

        scene.add(new THREE.AmbientLight(0x001122, 1.0));
        const ptMain = new THREE.PointLight(0x00d4b8, 4, 40);
        ptMain.position.set(3, 4, 6);
        scene.add(ptMain);
        const ptBlue = new THREE.PointLight(0x0055ff, 2.5, 35);
        ptBlue.position.set(-8, -3, 4);
        scene.add(ptBlue);

        const mainGroup = new THREE.Group();
        mainGroup.position.set(5.5, 0, 0);
        scene.add(mainGroup);

        const termGroup = new THREE.Group();
        mainGroup.add(termGroup);

        // Terminal frame
        const frameGeo = new THREE.BoxGeometry(4.2, 2.8, 0.08);
        const frameMat = new THREE.MeshStandardMaterial({
          color: 0x0a1628,
          metalness: 0.7,
          roughness: 0.3,
          transparent: true,
          opacity: 0,
        });
        termGroup.add(new THREE.Mesh(frameGeo, frameMat));

        const edgesMat = new THREE.LineBasicMaterial({
          color: 0x00d4b8,
          transparent: true,
          opacity: 0,
        });
        termGroup.add(
          new THREE.LineSegments(new THREE.EdgesGeometry(frameGeo), edgesMat),
        );

        const topBarMat = new THREE.MeshStandardMaterial({
          color: 0x00d4b8,
          metalness: 0.8,
          roughness: 0.2,
          transparent: true,
          opacity: 0,
          emissive: new THREE.Color(0x00d4b8),
          emissiveIntensity: 0.3,
        });
        const topBar = new THREE.Mesh(
          new THREE.BoxGeometry(4.2, 0.28, 0.09),
          topBarMat,
        );
        topBar.position.set(0, 1.26, 0.01);
        termGroup.add(topBar);

        TRAFFIC_LIGHTS.forEach(function (light) {
          const dot = new THREE.Mesh(
            new THREE.CircleGeometry(0.07, 16),
            new THREE.MeshBasicMaterial({
              color: light.col,
              transparent: true,
              opacity: 0,
            }),
          );
          dot.position.set(light.x, 1.26, 0.05);
          termGroup.add(dot);
        });

        const codeSprites = [];
        CODE_LINES.forEach(function (line) {
          const c = document.createElement("canvas");
          c.width = 512;
          c.height = 40;
          const ctx = c.getContext("2d");
          ctx.fillStyle = "#" + line.color.toString(16).padStart(6, "0");
          ctx.font = "18px Space Mono, monospace";
          ctx.textBaseline = "middle";
          ctx.fillText(line.text, 12, 20);
          const spr = makeSprite(THREE, c);
          spr.scale.set(3.5, 0.28, 1);
          spr.position.set(-0.15, line.y, 0.06);
          termGroup.add(spr);
          codeSprites.push(spr);
        });

        const curC = document.createElement("canvas");
        curC.width = 32;
        curC.height = 40;
        const curCtx = curC.getContext("2d");
        curCtx.fillStyle = "#00D4B8";
        curCtx.fillRect(0, 8, 16, 24);
        const cursorSpr = makeSprite(THREE, curC);
        cursorSpr.scale.set(0.22, 0.28, 1);
        cursorSpr.position.set(-1.58, -0.9, 0.06);
        termGroup.add(cursorSpr);

        const scanMat = new THREE.MeshBasicMaterial({
          color: 0x00d4b8,
          transparent: true,
          opacity: 0,
        });
        const scanLine = new THREE.Mesh(
          new THREE.BoxGeometry(4.0, 0.015, 0.06),
          scanMat,
        );
        termGroup.add(scanLine);

        // Circuit — skip on mobile for perf
        const circuitGroup = new THREE.Group();
        mainGroup.add(circuitGroup);

        const TRACES = isMobile
          ? []
          : [
              [
                new THREE.Vector3(2.5, 1.4, 0),
                new THREE.Vector3(3.8, 1.4, 0),
                new THREE.Vector3(3.8, 0.2, 0),
                new THREE.Vector3(5.0, 0.2, 0),
              ],
              [
                new THREE.Vector3(2.5, -0.5, 0),
                new THREE.Vector3(3.4, -0.5, 0),
                new THREE.Vector3(3.4, -1.5, 0),
                new THREE.Vector3(4.8, -1.5, 0),
              ],
              [
                new THREE.Vector3(-2.5, 0.8, 0),
                new THREE.Vector3(-3.5, 0.8, 0),
                new THREE.Vector3(-3.5, -0.3, 0),
                new THREE.Vector3(-5.0, -0.3, 0),
              ],
              [
                new THREE.Vector3(-2.5, -1.0, 0),
                new THREE.Vector3(-3.2, -1.0, 0),
                new THREE.Vector3(-3.2, 0.6, 0),
                new THREE.Vector3(-4.5, 0.6, 0),
              ],
              [new THREE.Vector3(2.5, 0.5, 0), new THREE.Vector3(4.2, 0.5, 0)],
              [
                new THREE.Vector3(-2.5, 0.0, 0),
                new THREE.Vector3(-4.8, 0.0, 0),
              ],
            ];

        const allTraceLines = [];
        const pulses = [];
        const icNodes = [];
        const icNodeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.04);

        TRACES.forEach(function (pts) {
          const mat = new THREE.LineBasicMaterial({
            color: 0x00d4b8,
            transparent: true,
            opacity: 0,
          });
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            mat,
          );
          circuitGroup.add(line);
          allTraceLines.push(line);

          for (let ni = 1; ni < pts.length - 1; ni++) {
            const n = new THREE.Mesh(
              icNodeGeo,
              new THREE.MeshStandardMaterial({
                color: 0x00d4b8,
                metalness: 1,
                roughness: 0,
                emissive: new THREE.Color(0x00d4b8),
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0,
              }),
            );
            n.position.copy(pts[ni]);
            n.userData.phase = Math.random() * Math.PI * 2;
            circuitGroup.add(n);
            icNodes.push(n);
          }

          const pulse = new THREE.Mesh(
            new THREE.SphereGeometry(0.06, 8, 8),
            new THREE.MeshBasicMaterial({
              color: 0x00d4b8,
              transparent: true,
              opacity: 0,
            }),
          );
          pulse.userData.pts = pts;
          pulse.userData.t = Math.random();
          pulse.userData.speed = 0.005 + Math.random() * 0.005;
          circuitGroup.add(pulse);
          pulses.push(pulse);
        });

        // Tag sprites — fewer on mobile
        const tagSprites = [];
        const activeTags = isMobile ? TECH_TAGS.slice(0, 8) : TECH_TAGS;
        activeTags.forEach(function (word, i) {
          const c = document.createElement("canvas");
          c.width = 200;
          c.height = 48;
          const ctx = c.getContext("2d");
          const col = TAG_COLORS[i % TAG_COLORS.length];
          ctx.fillStyle = col + "22";
          ctx.strokeStyle = col + "99";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(2, 2, 196, 44);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = col;
          ctx.font = "bold 16px Space Mono, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(word, 100, 24);
          const spr = makeSprite(THREE, c);
          spr.scale.set(1.4, 0.34, 1);
          const ringIdx = Math.floor(i / 7);
          const ring = TAG_RINGS[ringIdx] || TAG_RINGS[1];
          spr.userData.baseAngle = (i / activeTags.length) * Math.PI * 2;
          spr.userData.radius = ring.radius;
          spr.userData.tilt = ring.tilt;
          spr.userData.speed = ring.speed;
          spr.userData.yOff = (Math.random() - 0.5) * 0.5;
          spr.userData.phase = Math.random() * Math.PI * 2;
          scene.add(spr);
          tagSprites.push(spr);
        });

        const orbitRings = [];
        TAG_RINGS.forEach(function (o) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(o.radius, 0.007, 6, 120),
            new THREE.MeshBasicMaterial({
              color: 0x00d4b8,
              transparent: true,
              opacity: 0,
            }),
          );
          ring.rotation.x = o.tilt;
          ring.position.x = isMobile ? 2 : 5.5;
          scene.add(ring);
          orbitRings.push(ring);
        });

        // Bracket floaters — skip on mobile
        const bracketSprites = [];
        if (!isMobile) {
          BRACKETS.forEach(function (b) {
            const c = document.createElement("canvas");
            c.width = 120;
            c.height = 72;
            const ctx = c.getContext("2d");
            ctx.fillStyle = b.col;
            ctx.font = "bold 30px Space Mono, monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.globalAlpha = 0.65;
            ctx.fillText(b.sym, 60, 36);
            const spr = makeSprite(THREE, c);
            spr.scale.set(0.7, 0.42, 1);
            spr.position.set(
              (Math.random() - 0.5) * 10 - 2,
              (Math.random() - 0.5) * 7,
              (Math.random() - 0.5) * 3 - 2,
            );
            spr.userData.vx = (Math.random() - 0.5) * 0.005;
            spr.userData.initY = spr.position.y;
            spr.userData.phase = Math.random() * Math.PI * 2;
            spr.userData.speed = 0.4 + Math.random() * 0.4;
            scene.add(spr);
            bracketSprites.push(spr);
          });
        }

        // Stars — fewer on mobile
        const starCount = isMobile ? 200 : 500;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
          starPos[i * 3] = (Math.random() - 0.5) * 40;
          starPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
          starPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 5;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
        const starMesh = new THREE.Points(
          starGeo,
          new THREE.PointsMaterial({
            color: 0x00d4b8,
            size: 0.04,
            transparent: true,
            opacity: 0,
            sizeAttenuation: true,
          }),
        );
        scene.add(starMesh);

        // Binary rain canvas
        const bCanvas = document.createElement("canvas");
        bCanvas.style.cssText =
          "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.13;";
        mount.appendChild(bCanvas);
        const bCtx = bCanvas.getContext("2d");
        function resizeB() {
          bCanvas.width = mount.clientWidth;
          bCanvas.height = mount.clientHeight;
        }
        resizeB();
        const fSize = 13;
        let drops = [];
        function resetDrops() {
          drops = [];
          for (let i = 0; i < Math.floor(bCanvas.width / fSize); i++)
            drops.push(Math.random() * -60);
        }
        resetDrops();
        function drawRain() {
          bCtx.fillStyle = "rgba(6,8,16,0.09)";
          bCtx.fillRect(0, 0, bCanvas.width, bCanvas.height);
          bCtx.font = fSize + "px 'Space Mono',monospace";
          for (let i = 0; i < drops.length; i++) {
            const d = drops[i];
            const prog = d / (bCanvas.height / fSize);
            const bright = Math.sin(Math.max(0, prog) * Math.PI);
            bCtx.fillStyle =
              "rgba(0," +
              Math.floor(160 + bright * 80) +
              "," +
              Math.floor(130 + bright * 55) +
              "," +
              (0.18 + bright * 0.55) +
              ")";
            bCtx.fillText(
              Math.random() > 0.5 ? "1" : "0",
              i * fSize,
              d * fSize,
            );
            if (d * fSize > bCanvas.height && Math.random() > 0.975)
              drops[i] = 0;
            drops[i] += 0.6;
          }
        }

        // Progress bar
        const barWrap = document.createElement("div");
        barWrap.style.cssText =
          "position:absolute;bottom:2rem;right:5vw;z-index:6;display:flex;flex-direction:column;align-items:flex-end;gap:0.35rem;";
        barWrap.innerHTML =
          '<span id="pg-lbl" style="font-family:monospace;font-size:0.44rem;letter-spacing:0.2em;color:#00D4B8;">COMPILING · 0%</span><div style="width:110px;height:2px;background:rgba(0,212,184,0.12);border-radius:2px;overflow:hidden;"><div id="pg-bar" style="height:100%;width:0%;background:linear-gradient(to right,#00D4B8,#0099ff);border-radius:2px;"></div></div>';
        mount.appendChild(barWrap);
        const pgBar = barWrap.querySelector("#pg-bar");
        const pgLbl = barWrap.querySelector("#pg-lbl");
        const STEPS = ["COMPILING", "LINKING", "DEPLOYING", "RUNNING"];

        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        function onMM(e) {
          mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
          mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
        }
        window.addEventListener("mousemove", onMM);

        function onResize() {
          W = mount.clientWidth;
          H = mount.clientHeight;
          renderer.setSize(W, H);
          camera.aspect = W / H;
          camera.updateProjectionMatrix();
          resizeB();
          resetDrops();
        }
        window.addEventListener("resize", onResize);

        function easeOut3(x) {
          return 1 - Math.pow(1 - x, 3);
        }
        const DUR = 2800;
        let animId,
          startTime = null,
          assembled = false,
          bFrame = 0,
          t = 0;
        let frameCount = 0;

        function animate(now) {
          animId = requestAnimationFrame(animate);
           if (isPausedRef.current) return
          frameCount++;
          // Throttle to 30fps on mobile
          if (isMobile && frameCount % 2 !== 0) return;

          if (!startTime) startTime = now;
          const elapsed = now - startTime;
          t = elapsed * 0.001 * 0.65;

          const rawProg = Math.min(elapsed / DUR, 1);
          const prog = easeOut3(rawProg);
          const p2 = Math.min(prog * 1.6, 1);
          const p3 = Math.min(prog * 2.0, 1);

          if (!assembled) {
            const pct = Math.round(rawProg * 100);
            const step = Math.min(Math.floor(rawProg * 4), 3);
            if (pgBar) pgBar.style.width = pct + "%";
            if (pgLbl) pgLbl.textContent = STEPS[step] + " · " + pct + "%";
            if (rawProg >= 1) {
              assembled = true;
              setTimeout(function () {
                barWrap.style.transition = "opacity 0.8s";
                barWrap.style.opacity = "0";
              }, 500);
            }
          }

          frameMat.opacity = prog * 0.9;
          edgesMat.opacity = p2 * 0.75;
          topBarMat.opacity = p2 * 0.95;
          scanMat.opacity = prog > 0.1 ? 0.5 : 0;
          scanLine.position.y = 1.1 - prog * 2.6;

          for (let ci = 3; ci <= 5; ci++) {
            const ch = termGroup.children[ci];
            if (ch && ch.material) ch.material.opacity = p2 * 0.9;
          }

          codeSprites.forEach(function (s, i) {
            s.material.opacity = Math.min(
              Math.max(prog - i * 0.12, 0) * 2.5,
              0.88,
            );
          });

          cursorSpr.material.opacity =
            Math.floor(t * 2) % 2 === 0 ? p3 * 0.9 : 0;

          termGroup.position.y = Math.sin(t * 0.7) * 0.15;
          termGroup.rotation.y = mouse.x * 0.08;
          termGroup.rotation.x = mouse.y * 0.06;

          allTraceLines.forEach(function (l) {
            l.material.opacity = p2 * 0.22;
          });
          icNodes.forEach(function (n) {
            n.material.opacity = p2 * 0.8;
            n.material.emissiveIntensity =
              0.3 + Math.sin(t * 2 + n.userData.phase) * 0.2;
          });
          pulses.forEach(function (p) {
            p.userData.t += p.userData.speed;
            if (p.userData.t > 1) p.userData.t = 0;
            const pts = p.userData.pts;
            const seg = (pts.length - 1) * p.userData.t;
            const si = Math.floor(seg);
            const sf = seg - si;
            if (pts[si] && pts[si + 1])
              p.position.lerpVectors(pts[si], pts[si + 1], sf);
            p.material.opacity = p2 * 0.85;
          });

          tagSprites.forEach(function (spr) {
            const ud = spr.userData;
            const a = ud.baseAngle + t * ud.speed;
            spr.position.x = (isMobile ? 2 : 5.5) + Math.cos(a) * ud.radius;
            spr.position.z = Math.sin(a) * ud.radius * Math.cos(ud.tilt);
            spr.position.y =
              Math.sin(a) * ud.radius * Math.sin(ud.tilt) +
              ud.yOff +
              Math.sin(t * 0.5 + ud.phase) * 0.08;
            spr.material.opacity = prog * 0.82;
          });

          orbitRings.forEach(function (r) {
            r.material.opacity = prog * 0.1;
          });

          bracketSprites.forEach(function (s) {
            s.position.y =
              s.userData.initY +
              Math.sin(t * s.userData.speed + s.userData.phase) * 0.35;
            s.position.x += s.userData.vx;
            if (s.position.x > 8) s.position.x = -9;
            if (s.position.x < -9) s.position.x = 8;
            s.material.opacity = prog * 0.5;
          });

          starMesh.material.opacity = prog * 0.22;

          mouse.x += (mouse.tx - mouse.x) * 0.04;
          mouse.y += (mouse.ty - mouse.y) * 0.04;
          camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.04;
          camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.04;
          camera.lookAt(2.5, 0, 0);

          bFrame++;
          // Draw rain every 4th frame on mobile, every 2nd on desktop
          if (isMobile ? bFrame % 4 === 0 : bFrame % 2 === 0) drawRain();

          ptMain.intensity = 4 + Math.sin(t * 1.5) * 0.9;
          renderer.render(scene, camera);
        }

        animId = requestAnimationFrame(animate);
        if (onReady) onReady();

        mount._heroCleanup = function () {
          cancelAnimationFrame(animId);
          window.removeEventListener("mousemove", onMM);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
          if (mount.contains(renderer.domElement))
            mount.removeChild(renderer.domElement);
          if (mount.contains(bCanvas)) mount.removeChild(bCanvas);
          if (mount.contains(barWrap)) mount.removeChild(barWrap);
        };
      })
      .catch(() => {
        /* silent — fallback UI already visible */
      });

    return function () {
      cancelled = true;
      const m = mountRef.current;
      if (m && m._heroCleanup) {
        m._heroCleanup();
        m._heroCleanup = null;
      }
    };
  }, [onReady]);

  return (
    <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
  );
}

export default function Hero3D() {
  const sectionRef = useRef(null)  // ← add this
  const [webglSupported, setWebglSupported] = useState(true)
  const [ setSceneReady] = useState(false);

  // WebGL check — runs synchronously before any render
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }
    // Pre-load Three.js immediately on hero mount — it's above the fold
    loadThree().catch(() => setWebglSupported(false));
  }, []);

  const scrollTo = function (id) {
    const el = document.getElementById(id);
    if (el) {
      window.history.pushState(null, "", `#${id}`);
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#060810",
      }}
    >
      <style>{`
        @keyframes pulseDot {
          0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,212,184,0.5);}
          50%{opacity:0.7;box-shadow:0 0 0 5px rgba(0,212,184,0);}
        }
        @keyframes scrollAnim {
          0%{transform:scaleY(0);transform-origin:top;}
          50%{transform:scaleY(1);transform-origin:top;}
          51%{transform-origin:bottom;}
          100%{transform:scaleY(0);transform-origin:bottom;}
        }
        @keyframes hero-fadein { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }

        @media (max-width: 640px) {
          .hero-text-block { left: 5vw !important; max-width: 85vw !important; }
          .hero-meta-chips { display: none !important; }
          .hero-status-pill { font-size: 0.38rem !important; }
        }
      `}</style>

      {/* 3D canvas — only if WebGL supported */}
      {webglSupported && <HeroCanvas onReady={() => setSceneReady(true)} sectionRef={sectionRef} />}

      {/* Static dark bg fallback when no WebGL */}
      {!webglSupported && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(0,212,184,0.06) 0%, #060810 60%)",
          }}
        >
          {/* Simple CSS floating brackets as decorative fallback */}
          {["{  }", "< />", "[ ]", "( )"].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${55 + i * 12}%`,
                top: `${20 + i * 15}%`,
                fontFamily: "'Space Mono',monospace",
                fontSize: "1.5rem",
                color: TAG_COLORS[i] + "30",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Gradient overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(to right,rgba(6,8,16,0.97) 0%,rgba(6,8,16,0.93) 36%,rgba(6,8,16,0.55) 60%,rgba(6,8,16,0.05) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(to top,rgba(6,8,16,0.55) 0%,transparent 25%)",
        }}
      />

      {/* Status pill */}
      <div
        className="hero-status-pill"
        style={{
          position: "absolute",
          top: "4.5rem",
          left: "5vw",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "rgba(0,212,184,0.07)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(0,212,184,0.18)",
          borderRadius: "100px",
          padding: "0.35rem 0.85rem",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#00D4B8",
            animation: "pulseDot 2s infinite",
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(0.38rem,1.5vw,0.54rem)",
            letterSpacing: "0.15em",
            color: "#00D4B8",
            whiteSpace: "nowrap",
          }}
        >
          OPEN TO OPPORTUNITIES
        </span>
      </div>

      {/* Meta chips */}
      <div
        className="hero-meta-chips"
        style={{
          position: "absolute",
          top: "4.5rem",
          right: "5vw",
          zIndex: 5,
          display: "flex",
          gap: "0.4rem",
          pointerEvents: "none",
        }}
      >
        {[
          { l: "STATUS", v: "ACTIVE" },
          { l: "SDE", v: "WEBMINIX" },
          { l: "STACK", v: "MERN" },
        ].map(function (item) {
          return (
            <div
              key={item.l}
              style={{
                background: "rgba(6,8,16,0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "100px",
                padding: "0.32rem 0.8rem",
                display: "flex",
                gap: "0.45rem",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "clamp(0.36rem,1.3vw,0.44rem)",
                  letterSpacing: "0.12em",
                  color: "#9090A0",
                }}
              >
                {item.l}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "clamp(0.4rem,1.4vw,0.5rem)",
                  fontWeight: 700,
                  color: "#00D4B8",
                }}
              >
                {item.v}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main text */}
      <div
        className="hero-text-block"
        style={{
          position: "absolute",
          left: "5vw",
          top: "30%",
          transform: "translateY(-50%)",
          zIndex: 4,
          maxWidth: "48vw",
          animation: "hero-fadein 0.8s ease both",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(0.4rem,1.6vw,0.65rem)",
            letterSpacing: "0.22em",
            color: "#00D4B8",
            marginBottom: "0.9rem",
          }}
        >
          SOFTWARE DEVELOPER · MERN STACK · Web Designer
        </div>
        <h1
          style={{
            fontFamily: "'Syne',sans-serif",
            fontSize: "clamp(2.6rem,9vw,6.5rem)",
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            background:
              "linear-gradient(140deg,#fff 0%,rgba(255,255,255,0.88) 45%,#00D4B8 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "1.1rem",
          }}
        >
          PRIYA
          <br />
          GUPTA.
        </h1>
        <p
          style={{
            fontSize: "clamp(0.8rem,2.2vw,0.98rem)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75,
            maxWidth: 400,
            marginBottom: "2rem",
          }}
        >
          Building secure, scalable web systems — from real-time APIs to
          AI-powered interfaces. Precision in every line of code.
        </p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <button
            onClick={function () {
              scrollTo("projects");
            }}
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "clamp(0.5rem,1.7vw,0.62rem)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#000",
              background: "#00D4B8",
              border: "none",
              borderRadius: 10,
              padding: "0.85rem 1.6rem",
              cursor: "pointer",
              transition: "transform 0.2s,box-shadow 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={function (e) {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 28px rgba(0,212,184,0.45)";
            }}
            onMouseLeave={function (e) {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            VIEW PROJECTS
          </button>
          <button
            onClick={function () {
              scrollTo("contact");
            }}
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "clamp(0.5rem,1.7vw,0.62rem)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#fff",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              padding: "0.85rem 1.6rem",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={function (e) {
              e.currentTarget.style.borderColor = "rgba(0,212,184,0.5)";
              e.currentTarget.style.background = "rgba(0,212,184,0.08)";
            }}
            onMouseLeave={function (e) {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            GET IN TOUCH
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.46rem",
            letterSpacing: "0.22em",
            color: "#9090A0",
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1,
            height: 52,
            background: "linear-gradient(to bottom,#00D4B8,transparent)",
            animation: "scrollAnim 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
