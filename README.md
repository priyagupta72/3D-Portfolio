# Priya Gupta — 3D Portfolio

<div align="center">

![Portfolio Preview](https://img.shields.io/badge/Status-Live-00D4B8?style=for-the-badge)
![Lighthouse Performance](https://img.shields.io/badge/Lighthouse-93%25-00D4B8?style=for-the-badge&logo=lighthouse)
![License](https://img.shields.io/badge/License-MIT-0099ff?style=for-the-badge)

**A fully 3D, WebGL-powered developer portfolio built with React and Three.js**

[Live Demo](#) · [Report Bug](https://github.com/priyagupta72/3D-Portfolio/issues) · [Connect on LinkedIn](https://www.linkedin.com/in/priya-gupta-6a68b1257/)

</div>

---

## Overview

A production-grade 3D portfolio showcasing full-stack engineering work. Built with performance-first principles — lazy loaded WebGL scenes, shared Three.js chunk, and all Core Web Vitals in the green zone.

---

## Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat-square&logo=three.js)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![EmailJS](https://img.shields.io/badge/EmailJS-Contact_Form-FF6B35?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

</div>

---

## Features

- **Fully 3D** — Six interactive Three.js WebGL scenes across all sections
- **Performance optimised** — Lazy loading with IntersectionObserver, shared Three.js bundle chunk, 93 Lighthouse desktop score
- **Core Web Vitals** — LCP 1.3s, CLS 0, TBT 0ms on desktop
- **Contact form** — EmailJS integration with auto-reply automation
- **Responsive** — Mobile-first with graceful WebGL fallbacks
- **Visibility pause** — Animation loops pause when section is off-screen

---

## Lighthouse Scores

| Metric | Score |
|--------|-------|
| Performance (Desktop) | 93 |
| Accessibility | 91 |
| Best Practices | 100 |
| SEO | 90 |
| LCP | 1.3s |
| CLS | 0 |
| TBT | 0ms |

---

## Screenshots

> Add screenshots of your portfolio sections here
><img width="1920" height="850" alt="Screenshot (850)" src="https://github.com/user-attachments/assets/4260bb9f-dcfb-4976-a758-44bfab2e9870" />


---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/priyagupta72/3D-Portfolio.git

# Navigate into the project
cd 3D-Portfolio

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID=your_autoreply_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

> Get your keys from [EmailJS Dashboard](https://emailjs.com)

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npx serve dist
```

---

## Project Structure

```
src/
├── components/
│   ├── Hero3D.jsx          # Landing section with terminal 3D scene
│   ├── About3D.jsx         # Journey timeline with ambient gems
│   ├── TechStack3D.jsx     # Tech stack with 3D visualization
│   ├── Experience3D.jsx    # Experience timeline with interactive nodes
│   ├── Projects3D.jsx      # Project showcase with 3D assembly
│   └── Contact.jsx         # Contact form with EmailJS
├── hooks/
│   ├── useFadeUp.js        # Scroll-triggered fade animations
│   └── useVisibilityPause.js # Pause WebGL when off-screen
├── App.jsx                 # Lazy loading + IntersectionObserver
└── index.css               # Global styles
```

---

## Performance Optimisations

- **Lazy loading** — All below-fold sections load only when 300px from viewport
- **Manual chunks** — Three.js isolated in `vendor-three` chunk, downloaded once and cached
- **Pre-allocated vectors** — No `new THREE.Vector3()` inside animation loops
- **Visibility pause** — `isPausedRef` stops render loop when section is not visible
- **Mobile throttling** — 30fps cap and reduced geometry on mobile devices
- **GPU compositing** — `will-change: transform` on animated cards

---

## Deployment

Deployed on Vercel. Add environment variables in:
```
Vercel Dashboard → Project → Settings → Environment Variables
```

---

## Contact

**Priya Gupta** — Software Development Engineer

- Email: [priyagupta4245@gmail.com](mailto:priyagupta4245@gmail.com)
- LinkedIn: [priya-gupta-6a68b1257](https://www.linkedin.com/in/priya-gupta-6a68b1257/)
- GitHub: [priyagupta72](https://github.com/priyagupta72)
- LeetCode: [Priyagupta_7](https://leetcode.com/u/Priyagupta_7/)

---

<div align="center">
  <sub>Built with React · Three.js · Vite · EmailJS</sub>
</div>
