'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'

export default function RegisterPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(timer)
  }, [])

  // Removed the ': React.FormEvent' type annotation here to fix the JSX error
  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const result = await response.json()
      setLoading(false)

      if (!response.ok) {
        setMessage(result.error ?? 'Registration failed.')
        return
      }

      window.localStorage.setItem(
        'auto-ride-user',
        JSON.stringify(result.user)
      )

      window.dispatchEvent(new Event('auto-ride-session-change'))
      router.push('/book')
    } catch {
      setMessage('Connection error. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#08090d_0%,#0d1b2a_60%,#08090d_100%)] text-white font-sans relative overflow-hidden antialiased selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0 bg-[radial-gradient(ellipse,rgba(78,205,196,0.06)_0%,transparent_70%)]" />

      <section className="relative z-10 mx-auto flex w-full max-w-[440px] flex-col px-4 py-16 sm:px-6">
        <div 
          className={`bg-white/[0.025] border border-white/[0.07] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="text-center mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400/90">
              Create Account
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-100">
              Start booking rides
            </h1>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest uppercase text-[#4ECDC4] block">
                Full Name
              </label>
              <div className="relative border border-white/10 bg-white/[0.04] rounded-xl">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none opacity-60">
                  👤
                </span>
                <input
                  type="text"
                  name="register_name"
                  autoComplete="off"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-100 text-sm outline-none placeholder-slate-600 focus:placeholder-slate-500"
                  placeholder="Your Name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest uppercase text-[#4ECDC4] block">
                Email Address
              </label>
              <div className="relative border border-white/10 bg-white/[0.04] rounded-xl">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none opacity-60">
                  ✉️
                </span>
                <input
                  type="email"
                  name="register_email"
                  autoComplete="off"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-100 text-sm outline-none placeholder-slate-600 focus:placeholder-slate-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold tracking-widest uppercase text-[#4ECDC4] block">
                Secure Password
              </label>
              <div className="relative border border-white/10 bg-white/[0.04] rounded-xl">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none opacity-60">
                  🔒
                </span>
                <input
                  type="password"
                  name="register_password"
                  autoComplete="new-password"
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-100 text-sm outline-none placeholder-slate-600 focus:placeholder-slate-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {message && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-400 text-sm flex items-center gap-2.5">
                <span className="flex-shrink-0 text-base">⚠️</span>
                <p className="font-medium leading-tight">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 px-4 mt-2 rounded-xl text-sm font-extrabold tracking-wide text-[#08090d] border-none select-none transition-all duration-300 ${
                loading
                  ? 'bg-amber-400/40 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-br from-amber-400 to-yellow-500 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-[0_0_24px_rgba(212,175,55,0.25)]'
              }`}
            >
              {loading ? '⏳ Creating account...' : '✓ Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[10px] text-slate-600 font-black tracking-widest">ALREADY REGISTERED?</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-sm font-bold border border-white/10 text-slate-300 bg-white/[0.02] hover:bg-white/[0.06] hover:text-white transition-all duration-200"
          >
            ← Back to Sign In
          </Link>
        </div>
      </section>
    </div>
  )
}