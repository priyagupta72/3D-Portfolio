import { useState, useEffect } from "react";

const links = [
  { label: "ABOUT", href: "#about" },
  { label: "SKILLS", href: "#skills" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "PROJECTS", href: "#projects" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [ctaHover, setCtaHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll tracking
  useEffect(() => {

    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = [
        "about",
        "skills",
        "experience",
        "projects",
        "contact",
      ];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(id);
          window.history.replaceState(null, "", `#${id}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener("scroll", close, { once: true });
      return () => window.removeEventListener("scroll", close);
    }
  }, [menuOpen]);

  const scrollTo = (id) => {
    window.history.pushState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navBg =
    scrolled || menuOpen ? "rgba(6,8,16,0.96)" : "rgba(6,8,16,0.55)";
  const navShadow = scrolled ? "0 8px 40px rgba(0,0,0,0.4)" : "none";

  return (
    <>
      {/* ── NAV BAR ── */}
      <nav
        style={{
          position: "fixed",
          top: isMobile ? 0 : "1.5rem",
          left: isMobile ? 0 : "50%",
          right: isMobile ? 0 : "auto",
          transform: isMobile ? "none" : "translateX(-50%)",
          zIndex: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.5rem",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          background: navBg,
          border: isMobile ? "none" : "1px solid rgba(255,255,255,0.07)",
          borderBottom: isMobile ? "1px solid rgba(255,255,255,0.07)" : "none",
          borderRadius: isMobile ? 0 : "100px",
          padding: isMobile ? "0.75rem 1.25rem" : "0.65rem 1.6rem",
          whiteSpace: "nowrap",
          boxShadow: navShadow,
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        {/* Brand */}
        <span
          style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#fff",
            flexShrink: 0,
          }}
        >
          PRIYA.DEV
        </span>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {links.map(({ label, href }) => {
              const id = href.replace("#", "");
              const isActive = active === id;
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(id);
                  }}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: isActive ? "#00D4B8" : "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    paddingBottom: "2px",
                    borderBottom: isActive
                      ? "1px solid #00D4B8"
                      : "1px solid transparent",
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>
        )}

        {/* Right side: CTA + Hamburger */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
          }}
        >
          {/* CTA button — always visible */}
          <button
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: "#000",
              background: "#00D4B8",
              border: "none",
              borderRadius: "100px",
              padding: isMobile ? "0.4rem 0.9rem" : "0.5rem 1.2rem",
              cursor: "pointer",
              transform: ctaHover ? "scale(1.06)" : "scale(1)",
              boxShadow: ctaHover ? "0 0 22px rgba(0,212,184,0.45)" : "none",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            onClick={() => scrollTo("contact")}
          >
            HIRE ME
          </button>

          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{
                background: "transparent",
                border: "none",
                padding: "4px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "2px",
                  borderRadius: "2px",
                  background: "#00D4B8",
                  width: menuOpen ? "20px" : "20px",
                  transform: menuOpen
                    ? "rotate(45deg) translate(5px, 5px)"
                    : "none",
                  transition: "transform 0.25s ease, width 0.25s ease",
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "2px",
                  borderRadius: "2px",
                  background: "#00D4B8",
                  width: "14px",
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 0.2s ease",
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "2px",
                  borderRadius: "2px",
                  background: "#00D4B8",
                  width: "20px",
                  transform: menuOpen
                    ? "rotate(-45deg) translate(5px, -5px)"
                    : "none",
                  transition: "transform 0.25s ease",
                }}
              />
            </button>
          )}
        </div>
      </nav>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            top: "57px", // just below the navbar
            left: 0,
            right: 0,
            zIndex: 499,
            background: "rgba(6,8,16,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(0,212,184,0.15)",
            maxHeight: menuOpen ? "400px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0",
            }}
          >
            {links.map(({ label, href }, i) => {
              const id = href.replace("#", "");
              const isActive = active === id;
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(id);
                  }}
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    color: isActive ? "#00D4B8" : "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    padding: "0.85rem 0",
                    borderBottom:
                      i < links.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                  }}
                >
                  {label}
                  {isActive && (
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#00D4B8",
                        boxShadow: "0 0 8px #00D4B8",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 498,
            background: "transparent",
          }}
        />
      )}
    </>
  );
}
