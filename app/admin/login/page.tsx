'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminLoginPage() {
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
      if (data.user.role !== 'admin') { setError('⛔ Admin access required'); return }
      localStorage.setItem('auto-ride-user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('auto-ride-session-change'))
      router.push('/admin/dashboard')
    } catch {
      setError('Connection error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #08090d 0%, #110a04 60%, #08090d 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient orange glow top */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 70%)',
      }} />
      {/* Bottom teal glow */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '250px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)',
      }} />

      {/* Decorative corner lines */}
      <div style={{
        position: 'fixed', top: '2rem', left: '2rem', pointerEvents: 'none',
        width: '60px', height: '60px',
        borderTop: '1px solid rgba(249,115,22,0.2)',
        borderLeft: '1px solid rgba(249,115,22,0.2)',
        borderRadius: '4px 0 0 0',
      }} />
      <div style={{
        position: 'fixed', bottom: '2rem', right: '2rem', pointerEvents: 'none',
        width: '60px', height: '60px',
        borderBottom: '1px solid rgba(249,115,22,0.2)',
        borderRight: '1px solid rgba(249,115,22,0.2)',
        borderRadius: '0 0 4px 0',
      }} />

      <div style={{
        width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '18px', marginBottom: '1rem',
            background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))',
            border: '1px solid rgba(249,115,22,0.4)', fontSize: '1.9rem',
            boxShadow: '0 0 32px rgba(249,115,22,0.15)',
          }}>🔐</div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: '999px', padding: '0.2rem 0.85rem', marginBottom: '0.9rem',
            fontSize: '0.68rem', fontWeight: 700, color: '#f97316',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f97316', display: 'inline-block', animation: 'blink 1.5s infinite' }} />
            Restricted Access
          </div>

          <h1 style={{
            fontSize: '1.9rem', fontWeight: 900, letterSpacing: '-0.04em',
            color: '#f0f0f0', marginBottom: '0.3rem',
          }}>Admin Panel</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Authorized personnel only
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: '20px', padding: '2rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 0 60px rgba(249,115,22,0.06)',
        }}>
          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#f97316', display: 'block', marginBottom: '0.5rem',
              }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '1rem', pointerEvents: 'none',
                }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  autoComplete="off"
                  required
                  style={{
                    width: '100%', paddingLeft: '2.6rem', paddingRight: '1rem',
                    paddingTop: '0.75rem', paddingBottom: '0.75rem',
                    background: 'rgba(249,115,22,0.05)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    borderRadius: '12px', color: '#f0f0f0', fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(249,115,22,0.2)'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#f97316', display: 'block', marginBottom: '0.5rem',
              }}>Admin Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '1rem', pointerEvents: 'none',
                }}>🔑</span>
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
                    background: 'rgba(249,115,22,0.05)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    borderRadius: '12px', color: '#f0f0f0', fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.7)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(249,115,22,0.2)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '1rem', color: '#6b7280', padding: 0,
                  }}
                >{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem',
                background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                color: '#f87171', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
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
                background: loading ? 'rgba(249,115,22,0.3)' : 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
                color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 0 28px rgba(249,115,22,0.35)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 44px rgba(249,115,22,0.55)' }}
              onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(249,115,22,0.35)' }}
            >
              {loading ? '⏳ Verifying...' : '🔓 Access Admin Panel'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '0.72rem', color: '#4b5563', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Customer Login */}
          <Link href="/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.8rem', borderRadius: '12px', textDecoration: 'none',
            border: '1px solid rgba(78,205,196,0.2)', color: '#4ECDC4',
            fontSize: '0.875rem', fontWeight: 600,
            background: 'rgba(78,205,196,0.04)', transition: 'all 0.2s',
            boxSizing: 'border-box',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(78,205,196,0.1)'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(78,205,196,0.04)'}
          >
            🚗 Customer Login
          </Link>

          {/* Security notice */}
          <div style={{
            marginTop: '1.25rem', padding: '0.85rem 1rem', borderRadius: '10px',
            background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)',
          }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f97316', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
              ⚠️ Security Notice
            </p>
            <p style={{ fontSize: '0.72rem', color: '#6b7280', lineHeight: 1.6 }}>
              Restricted admin area. Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#4b5563', marginTop: '1.5rem' }}>
          © 2026 RideBook · Admin Portal
        </p>
      </div>

      <style>{`
        input::placeholder { color: #4b5563; }
        * { box-sizing: border-box; }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}