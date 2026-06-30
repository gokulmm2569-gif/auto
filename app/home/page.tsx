'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const RIDE_TYPES = [
  { icon: '🚗', name: 'Mini', price: '₹12/km', eta: '2 min', color: '#facc15', gradient: 'from-yellow-400/20 to-transparent' },
  { icon: '🚙', name: 'Sedan', price: '₹16/km', eta: '3 min', color: '#38bdf8', gradient: 'from-blue-400/20 to-transparent' },
  { icon: '🚐', name: 'SUV', price: '₹22/km', eta: '4 min', color: '#a78bfa', gradient: 'from-purple-400/20 to-transparent' },
  { icon: '⭐', name: 'Prime', price: '₹18/km', eta: '5 min', color: '#f472b6', gradient: 'from-pink-400/20 to-transparent' },
  { icon: '💎', name: 'Luxury', price: '₹25/km', eta: '6 min', color: '#34d399', gradient: 'from-emerald-400/20 to-transparent' },
  { icon: '✈️', name: 'Airport', price: '₹28/km', eta: '7 min', color: '#fb923c', gradient: 'from-orange-400/20 to-transparent' },
]

const STATS = [
  { value: '50K+', label: 'Active Riders', sub: 'Verified users' },
  { value: '4.9★', label: 'Safety Rating', sub: 'Top-tier drivers' },
  { value: '2 min', label: 'Pickup Time', sub: 'In city centers' },
  { value: '0', label: 'Surprise Fees', sub: 'Fixed pricing' },
]

export default function HomePage() {
  const [activeRide, setActiveRide] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ background: '#050507', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#fff', overflowX: 'hidden' }}>
      
      {/* Dynamic Background Elements */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: `radial-gradient(circle at 50% -10%, rgba(212,175,55,0.15) 0%, transparent 60%),
                     radial-gradient(circle at 0% 100%, rgba(56,189,248,0.05) 0%, transparent 40%)`,
      }} />

      {/* Modern Header */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: scrolled ? '1rem 4rem' : '1.5rem 4rem',
        background: scrolled ? 'rgba(5,5,7,0.8)' : 'transparent',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 24, height: 24, background: '#D4AF37', borderRadius: '6px', rotate: '45deg' }} />
          RIDEBOOK
        </div>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          {['Fleet', 'Safety', 'Business'].map(item => (
            <a key={item} href="#" style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af', textDecoration: 'none' }}>{item}</a>
          ))}
          <Link href="/login" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>Login</Link>
          <Link href="/book" style={{
            padding: '0.6rem 1.4rem', borderRadius: '10px', fontSize: '0.85rem',
            fontWeight: 700, background: '#fff', color: '#000', textDecoration: 'none'
          }}>Book a Ride</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ position: 'relative', zIndex: 1, paddingTop: '12rem', paddingBottom: '8rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '999px', padding: '0.4rem 1.2rem', marginBottom: '2.5rem'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em' }}>TAMIL NADU'S PREMIUM FLEET</span>
          <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>● 1,402 active drivers</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, letterSpacing: '-0.05em',
          lineHeight: 0.95, marginBottom: '2rem'
        }}>
          Elegance in <br />
          <span style={{ color: '#D4AF37' }}>Every Kilometer.</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: '#888', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Experience a new standard of transport. Fixed pricing, premium vehicles, and safety that never sleeps.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/book" style={{
            padding: '1.2rem 2.8rem', borderRadius: '14px', background: '#D4AF37', color: '#000',
            fontWeight: 800, fontSize: '1.1rem', textDecoration: 'none', boxShadow: '0 20px 40px rgba(212,175,55,0.2)'
          }}>Confirm My Ride →</Link>
        </div>
      </main>

      {/* Bento Grid Stats */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 8rem', padding: '0 2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1rem',
          height: '180px'
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#D4AF37', marginBottom: '0.2rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{s.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet Showcase: The Interactive Deck */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 10rem', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>The Fleet Selection</h2>
            <p style={{ color: '#555' }}>Choose the cabin that matches your mood.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '12px' }}>
             {RIDE_TYPES.map((_, i) => (
               <div key={i} onClick={() => setActiveRide(i)} style={{
                 width: 40, height: 6, borderRadius: '99px',
                 background: activeRide === i ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                 cursor: 'pointer', transition: '0.3s'
               }} />
             ))}
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '32px', overflow: 'hidden', minHeight: '400px'
        }}>
          {/* Visual Side */}
          <div style={{ 
            padding: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `radial-gradient(circle at center, rgba(${activeRide === 0 ? '250,204,21' : '212,175,55'}, 0.1) 0%, transparent 70%)`,
            transition: '0.5s all'
          }}>
             <div style={{ fontSize: '10rem', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
               {RIDE_TYPES[activeRide].icon}
             </div>
          </div>
          {/* Detail Side */}
          <div style={{ padding: '4rem', background: 'rgba(255,255,255,0.01)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ color: RIDE_TYPES[activeRide].color, fontWeight: 900, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Tier: {RIDE_TYPES[activeRide].name}
            </div>
            <h3 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem' }}>{RIDE_TYPES[activeRide].price}</h3>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
               <div>
                 <div style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Avg Arrival</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{RIDE_TYPES[activeRide].eta}</div>
               </div>
               <div>
                 <div style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>Capacity</div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>4 - 6 Riders</div>
               </div>
            </div>
            <Link href="/book" style={{
              padding: '1rem', borderRadius: '12px', background: '#fff', color: '#000',
              textAlign: 'center', fontWeight: 700, textDecoration: 'none'
            }}>Request {RIDE_TYPES[activeRide].name}</Link>
          </div>
        </div>
      </section>

      {/* Footer Minimalist */}
      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '1rem', color: '#D4AF37' }}>RIDEBOOK</div>
        <p style={{ color: '#444', fontSize: '0.8rem', marginBottom: '2rem' }}>Designed for the modern traveler. Licensed & Bonded 2026.</p>
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          {['Privacy', 'Legal', 'Instagram', 'Twitter'].map(link => (
            <a key={link} href="#" style={{ color: '#888', fontSize: '0.8rem', textDecoration: 'none' }}>{link}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050507; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #050507; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>
    </div>
  )
}