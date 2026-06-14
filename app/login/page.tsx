'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function UserLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      localStorage.setItem('auto-ride-user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('auto-ride-session-change'))
      router.push('/dashboard')
    } catch {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #08090d 0%, #0d1b2a 60%, #08090d 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 70%)',
      }} />
      {/* Bottom glow */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '300px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(78,205,196,0.06) 0%, transparent 70%)',
      }} />

      <div style={{
        width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '60px', height: '60px', borderRadius: '16px', marginBottom: '1rem',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
            border: '1px solid rgba(212,175,55,0.3)', fontSize: '1.8rem',
          }}>🚗</div>
          <h1 style={{
            fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.04em',
            color: '#f0f0f0', marginBottom: '0.3rem',
          }}>
            Welcome back
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Sign in to your RideBook account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '2rem',
          backdropFilter: 'blur(12px)',
        }}>
          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#4ECDC4', display: 'block', marginBottom: '0.5rem',
              }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '1rem', pointerEvents: 'none',
                }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="off"
                  required
                  style={{
                    width: '100%', paddingLeft: '2.6rem', paddingRight: '1rem',
                    paddingTop: '0.75rem', paddingBottom: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', color: '#f0f0f0', fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(78,205,196,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#4ECDC4', display: 'block', marginBottom: '0.5rem',
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '1rem', pointerEvents: 'none',
                }}>🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  style={{
                    width: '100%', paddingLeft: '2.6rem', paddingRight: '3rem',
                    paddingTop: '0.75rem', paddingBottom: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', color: '#f0f0f0', fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(78,205,196,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem',
                    color: '#6b7280', padding: 0,
                  }}
                >{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem',
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem', borderRadius: '12px',
                fontSize: '0.95rem', fontWeight: 800, letterSpacing: '-0.02em',
                background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #D4AF37 0%, #facc15 100%)',
                color: '#08090d', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 28px rgba(212,175,55,0.3)',
                transition: 'all 0.2s', marginBottom: '0',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(212,175,55,0.5)' }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(212,175,55,0.3)' }}
            >
              {loading ? '⏳ Signing in...' : '✓ Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            margin: '1.5rem 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ fontSize: '0.72rem', color: '#4b5563', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }} />
          </div>

          {/* Admin Login */}
          <Link href="/admin/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.8rem', borderRadius: '12px', textDecoration: 'none',
            border: '1px solid rgba(78,205,196,0.25)', color: '#4ECDC4',
            fontSize: '0.875rem', fontWeight: 600,
            background: 'rgba(78,205,196,0.05)', transition: 'all 0.2s',
            boxSizing: 'border-box',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(78,205,196,0.1)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(78,205,196,0.05)'}
          >
            🔐 Admin Login
          </Link>
        </div>

        {/* Sign up */}
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: '1.5rem' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#D4AF37', fontWeight: 700, textDecoration: 'none' }}>
            Sign up free →
          </Link>
        </p>
      </div>

      <style>{`
        input::placeholder { color: #4b5563; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}