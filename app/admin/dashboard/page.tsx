'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Booking {
  id: string
  guestName: string
  pickupLocation: string
  dropoffLocation: string
  paymentAmount: number
  status: string
}

interface Stats {
  total: number
  confirmed: number
  pending: number
  onlinePaymentTotalCash: number
  offlinePaymentTotalCash: number
  onlinePaymentMembersTotal: number
  offlineMembersTotal: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    confirmed: 0,
    pending: 0,
    onlinePaymentTotalCash: 0,
    offlinePaymentTotalCash: 0,
    onlinePaymentMembersTotal: 0,
    offlineMembersTotal: 0,
  })

  useEffect(() => {
    const userData = localStorage.getItem("auto-ride-user")

    if (!userData) {
      router.push("/admin/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setLoading(false)
  }, [router])

  useEffect(() => {
    const handleBookingCreated = () => {
      if (!user) return

      fetch(`/api/bookings?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setBookings(data.bookings)
          }
        })
    }

    window.addEventListener("booking-created", handleBookingCreated)

    return () => {
      window.removeEventListener("booking-created", handleBookingCreated)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    async function loadBookings() {
      if (!user) return
      try {
        const res = await fetch(`/api/bookings?email=${user.email}`)
        const data = await res.json()

        if (data.ok) {
          setBookings(data.bookings)
          setStats(data.stats)
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadBookings()
  }, [user])

  const handleLogout = () => {
    localStorage.removeItem('auto-ride-user')
    window.dispatchEvent(new Event('auto-ride-session-change'))
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#040814] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06),transparent_65%)]" />
        <div className="relative flex flex-col items-center">
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/30 animate-ping duration-1000" />
            <div className="absolute inset-0 rounded-2xl border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-2 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-xl">
              <span className="text-amber-500 font-sans text-sm font-black tracking-wider">RIDE</span>
            </div>
          </div>
          <h2 className="text-white text-base font-bold tracking-wide animate-pulse">Loading Dashboard Data...</h2>
          <p className="text-slate-400 text-xs mt-1">Setting up secure session</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 antialiased">
      
      {/* Background Graphic Patterns & Moving Ambient Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[5%] w-[700px] h-[700px] bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-5%] right-[5%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/8 to-transparent rounded-full blur-[130px] animate-pulse duration-[6000ms]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation Bar */}
        <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-2xl px-6 lg:px-12 py-5 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-5 justify-between sm:items-center">
            
            <div className="flex items-center gap-4.5">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse" />
                <div className="relative h-12 w-12 bg-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-center shadow-inner">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent font-black text-xl tracking-tight">R</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold tracking-tight text-white">Admin Management</h1>
                  <span className="text-[11px] font-bold bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" /> Live View
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">
                  Welcome back, <span className="text-white font-semibold underline decoration-amber-500/40 decoration-2 underline-offset-4">{user.name}</span>
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="self-start sm:self-auto px-5 py-2.5 text-sm font-bold tracking-wide text-slate-300 hover:text-rose-400 bg-slate-900/80 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900/50 rounded-xl transition-all duration-300 flex items-center gap-2.5 group shadow-md"
            >
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </header>

        {/* Workspace Container */}
        <main className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-12 flex-1">
          
          {/* Section: Premium Metric Bento Layout */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            {/* Card 1: Total Bookings */}
            <div className="relative group bg-gradient-to-b from-slate-900/70 to-slate-950/70 border border-slate-800/60 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1 shadow-xl hover:shadow-blue-500/5 overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-colors" />
              <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block">Total Bookings</span>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl lg:text-5xl font-black tracking-tight text-white">{stats.total}</span>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="text-blue-400 font-bold">All-time</span> platform orders
              </div>
            </div>

            {/* Card 2: Registered Users */}
            <div className="relative group bg-gradient-to-b from-slate-900/70 to-slate-950/70 border border-slate-800/60 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 shadow-xl hover:shadow-emerald-500/5 overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
              <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block">Registered Users</span>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {stats.onlinePaymentMembersTotal + stats.offlineMembersTotal}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active client profiles
              </div>
            </div>

            {/* Card 3: Gross Revenue */}
            <div className="relative group bg-gradient-to-b from-slate-900/70 to-slate-950/70 border border-slate-800/60 rounded-2xl p-6 transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 shadow-xl hover:shadow-amber-500/5 overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
              <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block">Gross Earnings</span>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-xl font-bold text-amber-500">₹</span>
                <span className="text-4xl lg:text-5xl font-black tracking-tight text-amber-400">
                  {(stats.onlinePaymentTotalCash + stats.offlinePaymentTotalCash).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">Combined</span> sales earnings
              </div>
            </div>

            {/* Card 4: Fulfillment Success Rate */}
            <div className="relative group bg-gradient-to-b from-slate-900/70 to-slate-950/70 border border-slate-800/60 rounded-2xl p-6 transition-all duration-300 hover:border-purple-500/40 hover:-translate-y-1 shadow-xl hover:shadow-purple-500/5 overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl group-hover:bg-purple-500/10 transition-colors" />
              <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase block">Booking Success Rate</span>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl lg:text-5xl font-black tracking-tight text-white">
                  {stats.total === 0 ? "0%" : `${Math.round((stats.confirmed / stats.total) * 100)}%`}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="text-purple-400 font-bold">Confirmed</span> trip ratio
              </div>
            </div>
          </section>

          {/* Section: Quick Actions / Links */}
          <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-4 bg-gradient-to-b from-amber-400 to-orange-500 rounded-md" />
              <h2 className="text-sm font-extrabold tracking-wider text-slate-300 uppercase">
                Management Directories
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1 */}
              <Link
                href="/admin/bookings"
                className="group relative p-6 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition-all duration-300 overflow-hidden shadow-md"
              >
                {/* Horizontal Sliding Laser Animation */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-200 group-hover:text-amber-400 transition-colors duration-300">View Booking Logs</span>
                  <div className="h-8 w-8 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center group-hover:border-amber-500/40 transition-all duration-300 transform group-hover:translate-x-1">
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                  Review, organize, and edit individual schedule listings, client routes, and active ride conditions.
                </p>
              </Link>

              {/* Box 2 */}
              <Link
                href="/admin/users"
                className="group relative p-6 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition-all duration-300 overflow-hidden shadow-md"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-200 group-hover:text-amber-400 transition-colors duration-300">Manage System Users</span>
                  <div className="h-8 w-8 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center group-hover:border-amber-500/40 transition-all duration-300 transform group-hover:translate-x-1">
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                  Audit registered accounts, check profiles, monitor client activity, and configure access permissions.
                </p>
              </Link>

              {/* Box 3 */}
              <Link
                href="/admin/settings"
                className="group relative p-6 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl transition-all duration-300 overflow-hidden shadow-md"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-200 group-hover:text-amber-400 transition-colors duration-300">Global Settings</span>
                  <div className="h-8 w-8 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center group-hover:border-amber-500/40 transition-all duration-300 transform group-hover:translate-x-1">
                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                  Adjust standard price multipliers, alter platform constants, and change regional interface rules.
                </p>
              </Link>
            </div>
          </section>

          {/* Section: Live Dispatch Table */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-4 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-md" />
              <h2 className="text-sm font-extrabold tracking-wider text-slate-300 uppercase">
                Recent Ride Stream
              </h2>
            </div>

            <div className="border border-slate-800/80 bg-slate-950/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 bg-slate-950/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-5">ID</th>
                      <th className="px-6 py-5">Customer Name</th>
                      <th className="px-6 py-5">Trip Route</th>
                      <th className="px-6 py-5">Payment Amount</th>
                      <th className="px-6 py-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-sm">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 mb-4 text-slate-400 text-lg">
                            ✕
                          </div>
                          <span className="text-sm tracking-wide block text-slate-400 font-semibold">No recent bookings found</span>
                          <p className="text-xs text-slate-500 mt-1">New incoming platform requests will appear here dynamically.</p>
                        </td>
                      </tr>
                    ) : (
                      bookings.map((row: Booking) => (
                        <tr key={row.id} className="hover:bg-slate-900/40 transition-colors duration-200 group">
                          <td className="px-6 py-4.5 font-mono text-xs text-slate-400 group-hover:text-amber-400 transition-colors duration-200">
                            #{row.id.slice(0, 8).toUpperCase()}
                          </td>
                          <td className="px-6 py-4.5 text-slate-200 font-bold">
                            {row.guestName}
                          </td>
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3 text-slate-300">
                              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-sm text-slate-200 shadow-sm">{row.pickupLocation}</span>
                              <span className="text-slate-600 font-bold text-sm">→</span>
                              <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-sm text-slate-400 shadow-sm">{row.dropoffLocation}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 text-slate-200 font-extrabold text-base">
                            ₹{row.paymentAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border shadow-sm ${
                              row.status === 'confirmed'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.06)]'
                                : row.status === 'pending'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.06)]'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}>
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                row.status === 'confirmed' ? 'bg-emerald-400 animate-pulse' : row.status === 'pending' ? 'bg-amber-400 animate-pulse' : 'bg-slate-400'
                              }`} />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}