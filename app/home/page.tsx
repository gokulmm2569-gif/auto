'use client'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

const RIDE_TYPES = [
  { icon: '🚗', name: 'Mini', price: '₹12/km', eta: '2 min', color: '#facc15' },
  { icon: '🚙', name: 'Sedan', price: '₹16/km', eta: '3 min', color: '#38bdf8' },
  { icon: '🚐', name: 'SUV', price: '₹22/km', eta: '4 min', color: '#a78bfa' },
  { icon: '⭐', name: 'Prime', price: '₹18/km', eta: '5 min', color: '#f472b6' },
  { icon: '💎', name: 'Luxury', price: '₹25/km', eta: '6 min', color: '#34d399' },
  { icon: '✈️', name: 'Airport', price: '₹28/km', eta: '7 min', color: '#fb923c' },
]

const STATS = [
  { value: '50K+', label: 'Happy Riders' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '2 min', label: 'Avg Pickup Time' },
  { value: '24/7', label: 'Support' },
]

const FEATURES = [
  { icon: '⚡', title: 'Book in 60 seconds', desc: 'No friction, no fuss. Pick up, drop off, done.' },
  { icon: '🛡️', title: 'Verified drivers only', desc: 'Background-checked, licensed, and rated by riders like you.' },
  { icon: '📍', title: 'Live GPS tracking', desc: 'Share your ride in real time with anyone you trust.' },
  { icon: '💸', title: 'Fare you see upfront', desc: 'Price locked before you tap confirm. Zero surprises.' },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let start = 0
    const duration = 1800
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function HomePage() {
  const [activeRide, setActiveRide] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    setTimeout(() => setVisible(true), 100)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveRide(r => (r + 1) % RIDE_TYPES.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: '#08090d', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif", color: '#f0f0f0', overflowX: 'hidden' }}>

      {/* Ambient glow bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,175,55,0.13) 0%, transparent 70%)',
      }} />

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '64px',
        background: scrolled ? 'rgba(8,9,13,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.15)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#D4AF37' }}>
          ◈ RideBook
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/login" style={{
            padding: '0.45rem 1.1rem', borderRadius: '8px', fontSize: '0.85rem',
            fontWeight: 600, color: '#D4AF37', border: '1px solid rgba(212,175,55,0.4)',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>Login</Link>
          <Link href="/register" style={{
            padding: '0.45rem 1.2rem', borderRadius: '8px', fontSize: '0.85rem',
            fontWeight: 700, background: '#D4AF37', color: '#08090d',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>Sign Up →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '7rem 1.5rem 5rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
          borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '2rem',
          fontSize: '0.78rem', fontWeight: 600, color: '#D4AF37', letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
          Now live in Tamil Nadu
        </div>

        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-0.04em', marginBottom: '1.5rem', maxWidth: '800px',
        }}>
          Your ride,<br />
          <span style={{
            background: 'linear-gradient(90deg, #D4AF37 0%, #facc15 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>on your terms.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#9ca3af',
          maxWidth: '520px', lineHeight: 1.7, marginBottom: '3rem',
        }}>
          Book any ride in seconds. Track live. Pay what you see upfront — no surprises, ever.
        </p>

        {/* CTA Row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link href="/book" style={{
            padding: '0.9rem 2.2rem', borderRadius: '12px', fontWeight: 800,
            fontSize: '1rem', background: '#D4AF37', color: '#08090d',
            textDecoration: 'none', letterSpacing: '-0.01em',
            boxShadow: '0 0 32px rgba(212,175,55,0.35)',
            transition: 'all 0.2s',
          }}>Book Your Ride →</Link>
          <Link href="/register" style={{
            padding: '0.9rem 2rem', borderRadius: '12px', fontWeight: 600,
            fontSize: '1rem', color: '#e5e7eb',
            border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none',
            background: 'rgba(255,255,255,0.04)',
          }}>Create Free Account</Link>
        </div>

        {/* Live ride picker */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '1.5rem 2rem', maxWidth: '520px', width: '100%',
          backdropFilter: 'blur(12px)',
        }}>
          <p style={{ fontSize: '0.72rem', color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Available right now</p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {RIDE_TYPES.map((r, i) => (
              <div key={i} onClick={() => setActiveRide(i)} style={{
                padding: '0.5rem 0.9rem', borderRadius: '10px', cursor: 'pointer',
                border: `1px solid ${activeRide === i ? r.color : 'rgba(255,255,255,0.08)'}`,
                background: activeRide === i ? `rgba(${r.color === '#facc15' ? '250,204,21' : '255,255,255'},0.08)` : 'transparent',
                transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.82rem', fontWeight: activeRide === i ? 700 : 400,
                color: activeRide === i ? r.color : '#6b7280',
              }}>
                <span>{r.icon}</span> {r.name}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              {RIDE_TYPES[activeRide].icon} {RIDE_TYPES[activeRide].name} — {RIDE_TYPES[activeRide].price}
            </span>
            <span style={{
              fontSize: '0.78rem', fontWeight: 700, color: '#34d399',
              background: 'rgba(52,211,153,0.1)', padding: '0.25rem 0.7rem', borderRadius: '99px',
            }}>
              ETA {RIDE_TYPES[activeRide].eta}
            </span>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        padding: '2.5rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem',
          textAlign: 'center',
        }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#D4AF37', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.75rem' }}>Why riders choose us</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '3.5rem' }}>
            Built around the rider.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '1.75rem',
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.35)'
                  ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(212,175,55,0.05)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'
                  ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '0.9rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#f0f0f0' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIDE TYPES */}
      <section style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.75rem' }}>Fleet</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '3rem' }}>
            Pick your ride type.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {RIDE_TYPES.map((r, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: '14px', padding: '1.5rem 1rem', textAlign: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = r.color
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${r.color}22`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{r.icon}</div>
                <div style={{ fontWeight: 700, color: r.color, fontSize: '0.95rem' }}>{r.name}</div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.25rem' }}>{r.price}</div>
                <div style={{
                  marginTop: '0.6rem', fontSize: '0.7rem', color: '#34d399',
                  background: 'rgba(52,211,153,0.1)', borderRadius: '99px', padding: '0.2rem 0.5rem',
                  display: 'inline-block',
                }}>{r.eta} away</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ position: 'relative', zIndex: 1, padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '0.75rem' }}>Simple as 1-2-3</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '3.5rem' }}>Your ride in 3 taps.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { step: '01', title: 'Set pickup & drop', desc: 'Enter where you are and where you\'re going.' },
              { step: '02', title: 'Choose your ride', desc: 'Pick a vehicle type that suits your trip.' },
              { step: '03', title: 'Sit back & ride', desc: 'Driver confirmed. Track live. Arrive in style.' },
            ].map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{
                  fontSize: '3.5rem', fontWeight: 900, color: 'rgba(212,175,55,0.12)',
                  letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '0.5rem',
                }}>{s.step}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ position: 'relative', zIndex: 1, padding: '2rem 1.5rem 5rem' }}>
        <div style={{
          maxWidth: '760px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)',
          border: '1px solid rgba(212,175,55,0.25)', borderRadius: '24px',
          padding: '3.5rem 2rem', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Ready to ride smarter?
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem', fontSize: '1rem' }}>
            Join 50,000+ riders. Your first ride is on us.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/book" style={{
              padding: '0.85rem 2rem', borderRadius: '12px', fontWeight: 800,
              background: '#D4AF37', color: '#08090d', textDecoration: 'none',
              fontSize: '0.95rem', boxShadow: '0 0 28px rgba(212,175,55,0.3)',
            }}>Book Now →</Link>
            <Link href="/register" style={{
              padding: '0.85rem 2rem', borderRadius: '12px', fontWeight: 600,
              border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37',
              textDecoration: 'none', fontSize: '0.95rem',
              background: 'transparent',
            }}>Create Account</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1rem', maxWidth: '1100px', margin: '0 auto',
      }}>
        <div style={{ fontWeight: 800, color: '#D4AF37', fontSize: '1rem' }}>◈ RideBook</div>
        <p style={{ color: '#4b5563', fontSize: '0.8rem' }}>© 2026 RideBook. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <a key={l} href="#" style={{ color: '#6b7280', fontSize: '0.8rem', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { transition: opacity 0.2s; }
        a:hover { opacity: 0.85; }
      `}</style>
    </div>
  )
}