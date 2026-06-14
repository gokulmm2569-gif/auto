'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Booking {
  id: string
  guestName: string
  pickupLocation: string
  dropoffLocation: string
  paymentAmount: number
  paymentMethod: string
  status: string
}

export default function BookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('auto-ride-user')
    if (!userData) {
      router.push('/admin/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    fetch(`/api/bookings?email=${parsedUser.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setBookings(data.bookings)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b4965] to-[#0d1b2a] flex items-center justify-center">
      <div className="text-center animate-pulse">
        <div className="text-6xl mb-6 animate-spin">📋</div>
        <p className="text-[#4ECDC4] text-lg font-semibold">Loading bookings...</p>
        <div className="mt-4 w-48 h-1 bg-[#1e3a5f] rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-[#4ECDC4] animate-loading-bar"></div>
        </div>
      </div>
    </div>
  )

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
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
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
            <div className="animate-slide-down">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce">📋</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f97316] to-[#4ECDC4] bg-clip-text text-transparent">
                  All Bookings
                </h1>
              </div>
              <p className="text-sm text-[#4ECDC4] mt-2 font-medium">
                Managing {bookings.length} bookings ✨
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
          {/* Bookings Table with Enhanced Design */}
          <div className="rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] overflow-hidden shadow-2xl animate-fade-in">
            {/* Table Header */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e3a5f] bg-gradient-to-r from-[#0a3a3a] to-[#0a4a5a]">
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Booking ID</th>
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Route</th>
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Payment</th>
                    <th className="px-6 py-4 text-left text-[#4ECDC4] font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#8a9bb5]">
                        <div className="flex items-center justify-center gap-4">
                          <div className="text-6xl">📭</div>
                          <div>
                            <p className="text-lg font-semibold mb-2">No bookings found</p>
                            <p className="text-sm">Bookings will appear here when customers book rides</p>
                          </div>
                        </div>
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
                        <td className="px-6 py-4 text-white font-mono font-semibold text-xs">{row.id}</td>
                        <td className="px-6 py-4 text-[#8a9bb5]">
                          <div className="flex items-center gap-2">
                            <div className="text-[#4ECDC4]">👤</div>
                            {row.guestName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#8a9bb5]">
                          <div className="flex items-center gap-2">
                            <span className="text-[#4ECDC4] font-medium">{row.pickupLocation}</span>
                            <span className="text-[#1e3a5f]">→</span>
                            <span className="text-[#34d399] font-medium">{row.dropoffLocation}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#34d399] font-bold text-lg">₹{row.paymentAmount}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-[#8a9bb5]">
                            {row.paymentMethod === 'online' ? '💳' : row.paymentMethod === 'offline' ? '💵' : '📝'}
                            {row.paymentMethod || '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                            row.status === 'CONFIRMED'
                              ? 'bg-gradient-to-r from-[#064e3b] to-[#065f46] text-[#34d399] shadow-lg shadow-[#34d399]/20'
                              : row.status === 'PENDING'
                                ? 'bg-gradient-to-r from-[#451a03] to-[#5c2403] text-[#f97316] shadow-lg shadow-[#f97316]/20'
                                : 'bg-gradient-to-r from-[#1e3a5f] to-[#0a4a4a] text-[#4ECDC4] shadow-lg shadow-[#4ECDC4]/20'
                          }`}>
                            {row.status === 'CONFIRMED' && '✅'}
                            {row.status === 'PENDING' && '⏳'}
                            {row.status === 'CANCELLED' && '❌'}
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Stats */}
            {bookings.length > 0 && (
              <div className="border-t border-[#1e3a5f] bg-gradient-to-r from-[#0a3a3a] to-[#0a4a4a] px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <span className="text-[#8a9bb5]">
                      Total: <span className="text-[#4ECDC4] font-bold">{bookings.length}</span>
                    </span>
                    <span className="text-[#8a9bb5]">
                      Confirmed: <span className="text-[#34d399] font-bold">{bookings.filter(b => b.status === 'CONFIRMED').length}</span>
                    </span>
                    <span className="text-[#8a9bb5]">
                      Pending: <span className="text-[#f97316] font-bold">{bookings.filter(b => b.status === 'PENDING').length}</span>
                    </span>
                  </div>
                  <div className="text-[#8a9bb5]">
                    Total Revenue: <span className="text-[#34d399] font-bold">₹{bookings.reduce((sum, b) => sum + b.paymentAmount, 0)}</span>
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