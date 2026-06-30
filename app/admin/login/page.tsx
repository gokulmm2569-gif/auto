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

  // Subtle entry fade trigger
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

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
      
      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }
      
      if (data.user.role !== 'admin') {
        setError('⛔ Admin access required')
        return
      }
      
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
    <div className="min-h-screen bg-gradient-to-br from-[#08090d] via-[#110a04] to-[#08090d] flex items-center justify-center p-4 font-sans relative overflow-hidden antialiased selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* Background Lighting Graphics */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[45%] bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(249,115,22,0.12),transparent_70%)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[radial-gradient(ellipse,rgba(249,115,22,0.06),transparent_70%)]" />
      </div>

      {/* Decorative Blueprint Corner Framework */}
      <div className="hidden sm:block absolute top-8 left-8 w-16 h-16 border-t border-l border-orange-500/20 rounded-tl pointer-events-none" />
      <div className="hidden sm:block absolute bottom-8 right-8 w-16 h-16 border-b border-r border-orange-500/20 rounded-br pointer-events-none" />

      {/* Centered Login Controller Box */}
      <div 
        className={`w-full max-w-[420px] relative z-10 transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        
        {/* Portal Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-orange-500/20 to-orange-500/05 border border-orange-500/40 text-3xl shadow-[0_0_32px_rgba(249,115,22,0.15)]">
            🔐
          </div>

          <div className="block mb-3.5">
            <span className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-full px-3.5 py-1 text-[11px] font-bold text-orange-500 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Restricted Access
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-100 mb-1">Admin Panel</h1>
          <p className="text-sm text-slate-500">Authorized personnel only</p>
        </div>

        {/* Dynamic Interactive Input Card */}
        <div className="bg-white/[0.025] border border-orange-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_60px_rgba(249,115,22,0.06)]">
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">

            {/* Email Field Block */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold tracking-widest uppercase text-orange-500 block">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none filter brightness-90">
                  ✉️
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  autoComplete="off"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-orange-500/[0.05] border border-orange-500/20 placeholder-slate-600 focus:placeholder-slate-500 rounded-xl text-slate-200 text-sm outline-none transition-colors duration-200 focus:border-orange-500/70"
                />
              </div>
            </div>

            {/* Password Field Block */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold tracking-widest uppercase text-orange-500 block">
                Admin Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none filter brightness-90">
                  🔑
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-orange-500/[0.05] border border-orange-500/20 placeholder-slate-600 focus:placeholder-slate-500 rounded-xl text-slate-200 text-sm outline-none transition-colors duration-200 focus:border-orange-500/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-base text-slate-500 hover:text-slate-400 p-0 transition-colors"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error Message Notice */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3 text-rose-400 text-sm flex items-center gap-2.5 animate-headShake">
                <span className="flex-shrink-0 text-base">⚠️</span>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Authentication Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl text-sm font-extrabold tracking-wide text-white transition-all duration-300 border-none select-none ${
                loading 
                  ? 'bg-orange-500/30 cursor-not-allowed shadow-none' 
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-[0_0_24px_rgba(249,115,22,0.3)] hover:shadow-[0_0_36px_rgba(249,115,22,0.5)]'
              }`}
            >
              {loading ? '⏳ Verifying Credentials...' : '🔓 Access Admin Panel'}
            </button>
          </form>

          {/* Graphical Splitter Rule */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] text-slate-600 font-black tracking-widest">OR</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Alternate Routing Gateway */}
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold text-[#4ECDC4] bg-[#4ECDC4]/[0.04] border border-[#4ECDC4]/20 hover:bg-[#4ECDC4]/10 transition-all duration-200"
          >
            🚗 Customer Login
          </Link>

          {/* Persistent Perimeter Guard Instructions */}
          <div className="mt-5 p-4 bg-orange-500/[0.04] border border-orange-500/10 rounded-xl space-y-1.5">
            <p className="text-[11px] font-bold tracking-wider text-orange-500 flex items-center gap-1.5 uppercase">
              ⚠️ Security Notice
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Restricted admin area. Unauthorized access attempts are flagged, compiled, and logged.
            </p>
          </div>
        </div>

        {/* Footer Claims Label */}
        <p className="text-center text-xs text-slate-600 mt-6 tracking-wide">
          © 2026 RideBook · Admin Portal
        </p>
      </div>
    </div>
  )
}