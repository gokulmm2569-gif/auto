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
        console.log(err)
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
      <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b4965] to-[#0d1b2a] flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="text-6xl mb-6 animate-spin">🔐</div>
          <p className="text-[#4ECDC4] text-lg font-semibold">Loading admin panel...</p>
          <div className="mt-4 w-48 h-1 bg-[#1e3a5f] rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-[#4ECDC4] animate-loading-bar"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <>
      {/* Global Styles for Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loading-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.6s ease-out 0.2s; }
        .animate-slide-in { animation: slide-in 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.5s ease-out; }
        .animate-loading-bar { animation: loading-bar 2s ease-out; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#16243d] to-[#0d1b2a]">
        {/* Animated Background Particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#4ECDC4] rounded-full opacity-5 blur-3xl animate-float"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-[#f97316] rounded-full opacity-5 blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-[#34d399] rounded-full opacity-5 blur-3xl animate-float"></div>
        </div>

        {/* Header with Glow Effect */}
        <div className="relative border-b border-[#1e3a5f] bg-gradient-to-r from-[#082020] via-[#0a3a4a] to-[#082020] px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="animate-slide-in">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce">🔐</div>
                <h1 className="text-3xl font-bold text-[#f97316] bg-gradient-to-r from-[#f97316] to-[#4ECDC4] bg-clip-text text-transparent drop-shadow-lg">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-sm text-[#4ECDC4] mt-2 font-medium">
                Welcome back, <span className="text-white font-bold">{user.name}</span> ✨
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="group rounded-xl bg-gradient-to-r from-[#4c0519] to-[#6b0f28] px-6 py-3 text-sm font-semibold text-[#f87171] hover:from-[#6b0f28] hover:to-[#8a1c3a] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#f87171]/50 animate-slide-in-right"
            >
              <span className="flex items-center gap-2">
                <span className="group-hover:translate-x-1 transition-transform">🚪</span>
                Logout
              </span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 relative">
          {/* Stats Grid with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#4ECDC4]/30 transition-all duration-300 animate-fade-in">
              <div className="text-5xl mb-4 group-hover:animate-bounce">📊</div>
              <p className="text-[#8a9bb5] text-sm font-medium">Total Bookings</p>
              <p className="text-4xl font-bold text-[#4ECDC4] mt-3 bg-gradient-to-r from-[#4ECDC4] to-[#34d399] bg-clip-text text-transparent">
                {stats.total}
              </p>
            </div>
            
            <div className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#34d399]/30 transition-all duration-300 animate-fade-in-delay">
              <div className="text-5xl mb-4 group-hover:animate-bounce">👥</div>
              <p className="text-[#8a9bb5] text-sm font-medium">Active Users</p>
              <p className="text-4xl font-bold text-[#34d399] mt-3 bg-gradient-to-r from-[#34d399] to-[#4ECDC4] bg-clip-text text-transparent">
                {stats.onlinePaymentMembersTotal + stats.offlineMembersTotal}
              </p>
            </div>
            
            <div className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/30 transition-all duration-300 animate-fade-in">
              <div className="text-5xl mb-4 group-hover:animate-bounce">💰</div>
              <p className="text-[#8a9bb5] text-sm font-medium">Revenue (Today)</p>
              <p className="text-4xl font-bold text-[#f97316] mt-3 bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">
                ₹{stats.onlinePaymentTotalCash + stats.offlinePaymentTotalCash}
              </p>
            </div>
            
            <div className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#4ECDC4]/30 transition-all duration-300 animate-fade-in-delay">
              <div className="text-5xl mb-4 group-hover:animate-bounce">✅</div>
              <p className="text-[#8a9bb5] text-sm font-medium">Completion Rate</p>
              <p className="text-4xl font-bold text-[#4ECDC4] mt-3 bg-gradient-to-r from-[#4ECDC4] to-[#f97316] bg-clip-text text-transparent">
                {stats.total === 0
                  ? "0%"
                  : `${Math.round((stats.confirmed / stats.total) * 100)}%`}
              </p>
            </div>
          </div>

          {/* Quick Actions with Enhanced Design */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 animate-slide-down">
              <span className="text-2xl">⚡</span>
              <span className="bg-gradient-to-r from-[#4ECDC4] to-[#f97316] bg-clip-text text-transparent">Quick Actions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                href="/admin/bookings"
                className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a4a4a] hover:from-[#0a4a4a] hover:to-[#0d6a6a] p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#4ECDC4]/40 animate-fade-in"
              >
                <div className="text-5xl mb-4 group-hover:rotate-12 transition-transform duration-300">📋</div>
                <p className="font-semibold text-white text-lg group-hover:text-[#4ECDC4] transition-colors">View Bookings</p>
                <p className="text-xs text-[#8a9bb5] mt-3">Manage all ride bookings and status</p>
              </Link>
              
              <Link
                href="/admin/users"
                className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a4a4a] hover:from-[#0a4a4a] hover:to-[#0d6a6a] p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#34d399]/40 animate-fade-in-delay"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👤</div>
                <p className="font-semibold text-white text-lg group-hover:text-[#34d399] transition-colors">Users</p>
                <p className="text-xs text-[#8a9bb5] mt-3">Manage customer accounts</p>
              </Link>
              
              <Link
                href="/admin/settings"
                className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a4a4a] hover:from-[#0a4a4a] hover:to-[#0d6a6a] p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/40 animate-fade-in"
              >
                <div className="text-5xl mb-4 group-hover:animate-spin duration-1000">⚙️</div>
                <p className="font-semibold text-white text-lg group-hover:text-[#f97316] transition-colors">Settings</p>
                <p className="text-xs text-[#8a9bb5] mt-3">Configure system settings</p>
              </Link>
            </div>
          </div>

          {/* Recent Activity Table with Enhanced Design */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 animate-slide-down">
              <span className="text-2xl">📈</span>
              <span className="bg-gradient-to-r from-[#34d399] to-[#4ECDC4] bg-clip-text text-transparent">Recent Activity</span>
            </h2>
            <div className="rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] overflow-hidden shadow-2xl animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1e3a5f] bg-gradient-to-r from-[#0a3a3a] to-[#0a4a5a]">
                      <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Booking ID</th>
                      <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Customer</th>
                      <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Route</th>
                      <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Amount</th>
                      <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[#8a9bb5]">
                          <div className="text-4xl mb-3">📭</div>
                          <p>No recent bookings</p>
                        </td>
                      </tr>
                    ) : (
                      bookings.map((row: Booking, index: number) => (
                        <tr 
                          key={row.id} 
                          className={`border-b border-[#1e3a5f] hover:bg-gradient-to-r from-[#0a4a4a] to-[#0a5a5a] transition-all duration-200 transform hover:scale-[1.01] ${
                            index % 2 === 0 ? 'bg-[#082020]/50' : 'bg-[#0a3a4a]/30'
                          }`}
                        >
                          <td className="px-6 py-4 text-white font-mono font-semibold">{row.id}</td>
                          <td className="px-6 py-4 text-[#8a9bb5]">{row.guestName}</td>
                          <td className="px-6 py-4 text-[#8a9bb5]">
                            <span className="text-[#4ECDC4]">{row.pickupLocation}</span>
                            <span className="mx-2">→</span>
                            <span className="text-[#34d399]">{row.dropoffLocation}</span>
                          </td>
                          <td className="px-6 py-4 text-[#34d399] font-bold">₹{row.paymentAmount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              row.status === 'confirmed' 
                                ? 'bg-[#34d399]/20 text-[#34d399]' 
                                : row.status === 'pending'
                                  ? 'bg-[#f97316]/20 text-[#f97316]'
                                  : 'bg-[#8a9bb5]/20 text-[#8a9bb5]'
                            }`}>
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
          </div>
        </div>
      </div>
    </>
  )
}