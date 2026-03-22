import { useState, useRef } from 'react'
import { useFadeUp } from '../hooks/useFadeUp'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID           = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID          = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_AUTO_REPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID  // ← add this
const EMAILJS_PUBLIC_KEY           = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
// SVG Icons
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polyline points="2,4 12,13 22,4"/>
  </svg>
)
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
)
const LeetCodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
  </svg>
)

const socials = [
  { icon: <MailIcon />,    label: 'priyagupta4245@gmail.com', href: 'https://mail.google.com/mail/?view=cm&to=priyagupta4245@gmail.com' },
  { icon: <LinkedInIcon />, label: 'LinkedIn Profile',         href: 'https://www.linkedin.com/in/priya-gupta-6a68b1257/' },
  { icon: <GitHubIcon />,   label: 'GitHub Profile',           href: 'https://github.com/priyagupta72' },
  { icon: <LeetCodeIcon />, label: 'Leetcode Profile',         href: 'https://leetcode.com/u/Priyagupta_7/' },
]

function SocialLink({ icon, label, href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" data-hover className="contact-social-link">
      <span className="contact-social-icon">{icon}</span>
      <span className="contact-social-label">{label}</span>
    </a>
  )
}

export default function Contact() {
  // ── FIX: formRef for EmailJS, formData for controlled inputs ──
  const formRef    = useRef()           // ref passed to emailjs.sendForm()
  const headRef    = useFadeUp(0)
  const bodyRef    = useFadeUp(0.15)

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors,   setErrors]   = useState({})
  const [status,   setStatus]   = useState('idle') // idle | sending | sent | error

  const validate = () => {
    const e = {}
    if (!formData.name.trim())    e.name    = 'Name is required'
    if (!formData.email.trim())   e.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email'
    if (!formData.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleChange = (field) => (e) => {
    setFormData(p => ({ ...p, [field]: e.target.value }))
    if (errors[field]) setErrors(p => ({ ...p, [field]: null }))
  }
const handleSubmit = (e) => {
  e.preventDefault()
  const errs = validate()
  if (Object.keys(errs).length) { setErrors(errs); return }
  setStatus('sending')

  // Email 1 — notification to YOU
  emailjs.sendForm(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    formRef.current,
    { publicKey: EMAILJS_PUBLIC_KEY }
  )
  .then(() => {
    // Email 2 — auto-reply to THEM
    return emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_AUTO_REPLY_TEMPLATE_ID,
      {
        user_name:  formData.name,
        user_email: formData.email,
        subject:    formData.subject,
        message:    formData.message,
      },
      { publicKey: EMAILJS_PUBLIC_KEY }
    )
  })
  .then(() => {
    setStatus('sent')
    setFormData({ name: '', email: '', subject: '', message: '' })
  })
  .catch((error) => {
    console.error('EmailJS error:', error)
    setStatus('error')
  })
}

  const inputStyle = (field) => ({
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${errors[field] ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: 12, padding: '0.85rem 1rem',
    color: '#fff', fontFamily: "'Syne',sans-serif", fontSize: '0.9rem',
    outline: 'none', width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  })

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .contact-section { padding: 6rem 5vw; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 4rem; margin-top: 3rem; align-items: start; }
        .contact-name-email-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .contact-socials-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .contact-social-link { display: flex; align-items: center; gap: 0.75rem; font-family: 'Space Mono', monospace; font-size: 0.6rem; letter-spacing: 0.1em; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 0.9rem 1.2rem; text-decoration: none; transition: all 0.25s ease; color: rgba(255,255,255,0.6); overflow: hidden; }
        .contact-social-link:hover { color: #00D4B8; background: rgba(0,212,184,0.08); border-color: rgba(0,212,184,0.35); transform: translateX(4px); }
        .contact-social-icon { flex-shrink: 0; display: flex; align-items: center; }
        .contact-social-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
        .contact-submit-btn { align-self: flex-start; }
        @media (max-width: 640px) {
          .contact-section { padding: 3.5rem 5vw !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .contact-name-email-row { grid-template-columns: 1fr !important; }
          .contact-submit-btn { width: 100% !important; justify-content: center !important; }
          .contact-socials-list { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 0.5rem !important; }
          .contact-social-link { flex-direction: column !important; justify-content: center !important; padding: 0.75rem 0.5rem !important; gap: 0.3rem !important; font-size: 0.45rem !important; text-align: center !important; }
          .contact-social-link:hover { transform: translateY(-2px) !important; }
        }
      `}</style>

      <section id="contact" className="contact-section" style={{ background: '#07090f', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          <div ref={headRef}>
            <div className="section-label">CONTACT</div>
            <h2 className="section-title">
              Let's<br /><span className="section-muted">connect.</span>
            </h2>
          </div>

          <div className="contact-grid">

            {/* Left — info */}
            <div>
              <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Have a project that needs a reliable backend engineer or full-stack developer who ships?
                Let's talk — I'm open to new opportunities and collaborations.
              </p>
              <div className="contact-socials-list">
                {socials.map((s, i) => <SocialLink key={i} {...s} />)}
              </div>
            </div>

            {/* Right — form */}
            <div ref={bodyRef}>
              {status === 'sent' ? (
                <div style={{ background: 'rgba(0,212,184,0.08)', border: '1px solid rgba(0,212,184,0.3)', borderRadius: 20, padding: '3rem 2rem', textAlign: 'center' }}>
                  <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00D4B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="9,12 11,14 15,10"/>
                    </svg>
                  </div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Message Sent!</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', color: '#00D4B8', letterSpacing: '0.1em' }}>I'LL GET BACK TO YOU SOON</div>
                  <button onClick={() => setStatus('idle')} style={{ marginTop: '1.5rem', fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', color: '#000', background: '#00D4B8', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
                    SEND ANOTHER
                  </button>
                </div>

              ) : status === 'error' ? (
                <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: 20, padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Something went wrong</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.55rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Please try emailing directly at priyagupta4245@gmail.com</div>
                  <button onClick={() => setStatus('idle')} style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.6rem', fontWeight: 700, color: '#000', background: '#00D4B8', border: 'none', borderRadius: 8, padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
                    TRY AGAIN
                  </button>
                </div>

              ) : (
                // ── KEY: ref={formRef} on the form, name="" on each input ──
                <form ref={formRef} onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  <div className="contact-name-email-row">
                    <div>
                      <label style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', letterSpacing: '0.18em', color: '#9090A0', display: 'block', marginBottom: '0.4rem' }}>YOUR NAME</label>
                      <input
                        type="text"
                        name="user_name"
                        value={formData.name}
                        onChange={handleChange('name')}
                        placeholder="e.g. Rahul Sharma"
                        style={inputStyle('name')}
                        onFocus={e => { e.target.style.borderColor = 'rgba(0,212,184,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,184,0.06)' }}
                        onBlur={e => { e.target.style.borderColor = errors.name ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }}
                      />
                      {errors.name && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', color: '#ff5050', marginTop: '0.3rem', display: 'block' }}>{errors.name}</span>}
                    </div>
                    <div>
                      <label style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', letterSpacing: '0.18em', color: '#9090A0', display: 'block', marginBottom: '0.4rem' }}>YOUR EMAIL</label>
                      <input
                        type="email"
                        name="user_email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        placeholder="you@company.com"
                        style={inputStyle('email')}
                        onFocus={e => { e.target.style.borderColor = 'rgba(0,212,184,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,184,0.06)' }}
                        onBlur={e => { e.target.style.borderColor = errors.email ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }}
                      />
                      {errors.email && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', color: '#ff5050', marginTop: '0.3rem', display: 'block' }}>{errors.email}</span>}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', letterSpacing: '0.18em', color: '#9090A0', display: 'block', marginBottom: '0.4rem' }}>SUBJECT</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange('subject')}
                      placeholder="Project Opportunity / Hiring / Collab"
                      style={inputStyle('subject')}
                      onFocus={e => { e.target.style.borderColor = 'rgba(0,212,184,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,184,0.06)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.52rem', letterSpacing: '0.18em', color: '#9090A0', display: 'block', marginBottom: '0.4rem' }}>MESSAGE</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange('message')}
                      placeholder="Tell me about your project or opportunity..."
                      rows={5}
                      style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 130 }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(0,212,184,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,184,0.06)' }}
                      onBlur={e => { e.target.style.borderColor = errors.message ? 'rgba(255,80,80,0.5)' : 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }}
                    />
                    {errors.message && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.5rem', color: '#ff5050', marginTop: '0.3rem', display: 'block' }}>{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="contact-submit-btn"
                    disabled={status === 'sending'}
                    style={{ fontFamily: "'Space Mono',monospace", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', color: '#000', background: status === 'sending' ? '#00b8a0' : '#00D4B8', border: 'none', borderRadius: 12, padding: '1rem 2rem', cursor: status === 'sending' ? 'default' : 'pointer', transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onMouseEnter={e => { if (status !== 'sending') { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 28px rgba(0,212,184,0.4)' } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                  >
                    {status === 'sending' ? (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg> SENDING...</>
                    ) : (
                      <>SEND MESSAGE <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7,7 17,7 17,17"/></svg></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}