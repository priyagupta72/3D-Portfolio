/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import Hero3D from "./components/Hero3D";
import Navbar from "./components/Navbar";
import "./index.css";

// ── Lazy load ALL below-fold sections ──────────────────────────────────────
const About3D = lazy(() => import("./components/About3D"));
const TechStack3D = lazy(() => import("./components/TechStack3D"));
const Experience3D = lazy(() => import("./components/Experience3D"));
const Projects3D = lazy(() => import("./components/Projects3D"));
const Contact = lazy(() => import("./components/Contact"));

// ── Intersection-aware lazy section ───────────────────────────────────────
function LazySection({ component: Component, fallbackHeight = "100vh", id }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} id={id}>
      {visible ? (
        <Suspense
          fallback={
            <div
              style={{
                height: fallbackHeight,
                background: "#060810",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                contain: "strict",
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  color: "rgba(0,212,184,0.4)",
                }}
              >
                LOADING...
              </span>
            </div>
          }
        >
          <Component />
        </Suspense>
      ) : (
        <div
          style={{
            height: fallbackHeight,
            background: "#060810",
            contain: "strict",
          }}
        />
      )}
    </div>
  );
}

// ── Custom cursor ──────────────────────────────────────────────────────────
function useCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const cur = cursorRef.current;
    const ring = ringRef.current;
    const m = mouseRef.current;

    const onMove = (e) => {
      m.x = e.clientX;
      m.y = e.clientY;
      cur.style.left = m.x + "px";
      cur.style.top = m.y + "px";
    };

    const animRing = () => {
      m.rx += (m.x - m.rx) * 0.12;
      m.ry += (m.y - m.ry) * 0.12;
      ring.style.left = m.rx + "px";
      ring.style.top = m.ry + "px";
      rafRef.current = requestAnimationFrame(animRing);
    };

    const addHover = () => {
      document.querySelectorAll("a,button,[data-hover]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cur.classList.add("hovering");
          ring.classList.add("hovering");
        });
        el.addEventListener("mouseleave", () => {
          cur.classList.remove("hovering");
          ring.classList.remove("hovering");
        });
      });
    };

    document.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animRing);
    addHover();
    const timer = setTimeout(addHover, 800);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timer);
    };
  }, []);

  return { cursorRef, ringRef };
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const { cursorRef, ringRef } = useCursor();

  return (
    <>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />

      <Navbar />

      <main>
        {/* Hero loads immediately — above the fold */}
        <Hero3D />

        {/* Below-fold sections — load only when scrolled near */}
        <LazySection component={About3D}      id="about"      fallbackHeight="100vh" />
        <LazySection component={TechStack3D}  id="tech"       fallbackHeight="100vh" />
        <LazySection component={Experience3D} id="experience" fallbackHeight="110vh" />
        <LazySection component={Projects3D}   id="projects"   fallbackHeight="130vh" />
        <LazySection component={Contact}      id="contact"    fallbackHeight="80vh"  />
      </main>

      <footer
        style={{
          background: "#060810",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "2rem 5vw",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          PRIYA GUPTA · PORTFOLIO 2026
        </span>
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          POWERED BY THREE.JS WebGL · FULLY 3D
        </span>
      </footer>
    </>
  );
}