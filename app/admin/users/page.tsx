'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Booking {
  id: string
  guestName: string
  guestPhone: string
  paymentAmount: number
}

interface User {
  guestName: string
  guestPhone: string
  totalBookings: number
  totalSpent: number
}

export default function UsersPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('auto-ride-user')
    if (!userData) {
      router.push('/admin/login')
      return
    }
    const parsedUser = JSON.parse(userData)

    fetch(`/api/bookings?email=${parsedUser.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setBookings(data.bookings)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  // Unique users from bookings
  const users = bookings.reduce((acc: User[], b: Booking) => {
    if (!acc.find(u => u.guestName === b.guestName)) {
      acc.push({
        guestName: b.guestName,
        guestPhone: b.guestPhone || '—',
        totalBookings: 1,
        totalSpent: Number(b.paymentAmount)
      })
    } else {
      const u = acc.find(u => u.guestName === b.guestName)
      if (u) {
        u.totalBookings++
        u.totalSpent += Number(b.paymentAmount)
      }
    }
    return acc
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b4965] to-[#0d1b2a] flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="text-6xl mb-6 animate-spin">👤</div>
        <p className="text-[#4ECDC4] text-lg font-semibold">Loading users...</p>
        <div className="mt-4 w-48 h-1 bg-[#1e3a5f] rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-[#4ECDC4] animate-loading-bar"></div>
        </div>
      </div>
    </div>
  )

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.paymentAmount), 0)

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
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loading-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.6s ease-out 0.2s; }
        .animate-slide-down { animation: slide-down 0.5s ease-out; }
        .animate-loading-bar { animation: loading-bar 2s ease-out; }
        .animate-icon-bounce { animation: icon-bounce 2s ease-in-out infinite; }
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
            <div className="animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-icon-bounce">👤</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f97316] to-[#4ECDC4] bg-clip-text text-transparent">
                  Users
                </h1>
              </div>
              <p className="text-sm text-[#4ECDC4] mt-2 font-medium">
                Manage {users.length} customers and view their stats ✨
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="group rounded-xl bg-gradient-to-r from-[#1e3a5f] to-[#0a4a4a] px-6 py-3 text-sm font-semibold text-[#4ECDC4] hover:from-[#0a4a4a] hover:to-[#0d6a6a] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#4ECDC4]/50 animate-slide-down"
            >
              <span className="flex items-center gap-2">
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Back to Dashboard
              </span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 relative">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#4ECDC4]/30 transition-all duration-300 animate-fade-in">
              <div className="text-5xl mb-4 group-hover:animate-bounce">👥</div>
              <p className="text-[#8a9bb5] text-sm font-medium">Total Users</p>
              <p className="text-4xl font-bold text-[#4ECDC4] mt-3 bg-gradient-to-r from-[#4ECDC4] to-[#34d399] bg-clip-text text-transparent">
                {users.length}
              </p>
            </div>
            
            <div className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#34d399]/30 transition-all duration-300 animate-fade-in-delay">
              <div className="text-5xl mb-4 group-hover:animate-bounce">📋</div>
              <p className="text-[#8a9bb5] text-sm font-medium">Total Bookings</p>
              <p className="text-4xl font-bold text-[#34d399] mt-3 bg-gradient-to-r from-[#34d399] to-[#4ECDC4] bg-clip-text text-transparent">
                {bookings.length}
              </p>
            </div>
            
            <div className="group rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#f97316]/30 transition-all duration-300 animate-fade-in">
              <div className="text-5xl mb-4 group-hover:animate-bounce">💰</div>
              <p className="text-[#8a9bb5] text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-[#f97316] mt-3 bg-gradient-to-r from-[#f97316] to-[#fb923c] bg-clip-text text-transparent">
                ₹{totalRevenue.toFixed(0)}
              </p>
            </div>
          </div>

          {/* Users Table with Enhanced Design */}
          <div className="rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] overflow-hidden shadow-2xl animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e3a5f] bg-gradient-to-r from-[#0a3a3a] to-[#0a4a5a]">
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Phone</th>
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Total Bookings</th>
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-[#8a9bb5]">
                        <div className="flex items-center justify-center gap-4">
                          <div className="text-6xl">📭</div>
                          <div>
                            <p className="text-lg font-semibold mb-2">No users found</p>
                            <p className="text-sm">Users will appear here when customers book rides</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((u, index: number) => (
                      <tr
                        key={index}
                        className={`border-b border-[#1e3a5f] hover:bg-gradient-to-r from-[#0a4a4a] to-[#0a5a5a] transition-all duration-200 transform hover:scale-[1.01] ${
                          index % 2 === 0 ? 'bg-[#082020]/50' : 'bg-[#0a3a4a]/30'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0a4a4a] flex items-center justify-center text-[#4ECDC4]">
                              {u.guestName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{u.guestName}</p>
                              <p className="text-xs text-[#8a9bb5]">Customer</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-[#8a9bb5]">
                            <span className="text-[#34d399]">📱</span>
                            {u.guestPhone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[#4ECDC4]">📋</span>
                            <span className="text-[#4ECDC4] font-bold">{u.totalBookings}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[#f97316]">💰</span>
                            <span className="text-[#34d399] font-bold text-lg">₹{u.totalSpent.toFixed(0)}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Stats */}
            {users.length > 0 && (
              <div className="border-t border-[#1e3a5f] bg-gradient-to-r from-[#0a3a3a] to-[#0a4a4a] px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <span className="text-[#8a9bb5]">
                      Users: <span className="text-[#4ECDC4] font-bold">{users.length}</span>
                    </span>
                    <span className="text-[#8a9bb5]">
                      Avg Bookings: <span className="text-[#34d399] font-bold">
                        {(bookings.length / users.length).toFixed(1)}
                      </span>
                    </span>
                    <span className="text-[#8a9bb5]">
                      Avg Spending: <span className="text-[#f97316] font-bold">
                        ₹{(totalRevenue / users.length).toFixed(0)}
                      </span>
                    </span>
                  </div>
                  <div className="text-[#8a9bb5]">
                    Top Spender: <span className="text-[#34d399] font-bold">
                      {users.reduce((max, u) => u.totalSpent > max.totalSpent ? u : max, users[0]).guestName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}