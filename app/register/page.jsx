'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
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

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

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
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:px-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-200/80">
            Create account
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            Start booking rides
          </h1>

          <form
            className="mt-8 grid gap-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <input
              type="text"
              name="register_name"
              autoComplete="off"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
              placeholder="Name"
            />

            <input
              type="email"
              name="register_email"
              autoComplete="off"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
              placeholder="Email"
            />

            <input
              type="password"
              name="register_password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none placeholder:text-zinc-500"
              placeholder="Password"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-yellow-400 px-6 py-3 font-medium text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            {message && (
              <p className="text-sm text-zinc-300">
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  )
} 