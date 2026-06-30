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

  // Aggregate customer details from bookings
  const users = bookings.reduce((acc: User[], b: Booking) => {
    const existingUser = acc.find(u => u.guestName === b.guestName)
    if (!existingUser) {
      acc.push({
        guestName: b.guestName,
        guestPhone: b.guestPhone || '—',
        totalBookings: 1,
        totalSpent: Number(b.paymentAmount)
      })
    } else {
      existingUser.totalBookings++
      existingUser.totalSpent += Number(b.paymentAmount)
    }
    return acc
  }, [])

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.paymentAmount), 0)
  const topSpender = users.length > 0 
    ? users.reduce((max, u) => u.totalSpent > max.totalSpent ? u : max, users[0]).guestName 
    : '—'

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="text-center">
        <div className="w-9 h-9 border-2 border-emerald-500/10 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-xs tracking-widest uppercase font-mono">Loading Customer Directory...</p>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes subtle-drift {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.02; }
          50% { transform: translateY(-20px) scale(1.05); opacity: 0.05; }
        }
        .animate-drift-slow { animation: subtle-drift 14s ease-in-out infinite; }
        .animate-drift-fast { animation: subtle-drift 9s ease-in-out infinite; animation-delay: 3s; }
      `}</style>

      <div className="min-h-screen bg-[#030712] text-slate-300 antialiased selection:bg-emerald-500/20 relative overflow-x-hidden">
        
        {/* Ambient Background Glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] animate-drift-slow" />
          <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] animate-drift-fast" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen font-sans">
          
          {/* Header */}
          <header className="border-b border-slate-900 bg-slate-950/40 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] tracking-widest text-emerald-400 font-mono uppercase bg-emerald-950/50 border border-emerald-900/40 px-2 py-0.5 rounded">Admin Dashboard</span>
                <h1 className="text-xl font-bold tracking-tight text-white mt-1.5 uppercase">
                  Customer Directory
                </h1>
              </div>

              <Link
                href="/admin/dashboard"
                className="px-4 py-2 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800/60 text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <span>←</span> Back to Dashboard
              </Link>
            </div>
          </header>

          {/* Core Layout Split Workspace */}
          <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT COLUMN: Overview Cards */}
            <div className="space-y-6 lg:sticky lg:top-24">
              
              {/* Revenue Card */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Total Sales Revenue</p>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </h3>
                
                <div className="mt-6 pt-4 border-t border-slate-900 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Total Customers</p>
                    <p className="text-base font-bold text-slate-200 mt-0.5">{users.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Total Bookings</p>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">{bookings.length}</p>
                  </div>
                </div>
              </div>

              {/* Top Spender Card */}
              <div className="rounded-2xl border border-slate-900 bg-gradient-to-br from-slate-950/60 to-emerald-950/10 p-6 shadow-md border-l-2 border-l-emerald-500/40">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <span className="text-sm">👑</span>
                  <p className="text-[10px] uppercase tracking-wider font-bold">Top Spending Customer</p>
                </div>
                <h4 className="text-lg font-bold text-white truncate">{topSpender}</h4>
                <p className="text-xs text-slate-400 mt-1">This client has generated the highest total booking value across all transactions.</p>
              </div>

              {/* System Performance Statistics */}
              {users.length > 0 && (
                <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Business Metrics</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                      <span className="text-xs text-slate-400">Average Trips per Customer</span>
                      <span className="text-xs font-mono font-bold text-white">{(bookings.length / users.length).toFixed(1)} rides</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                      <span className="text-xs text-slate-400">Average Spending per Customer</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">₹{(totalRevenue / users.length).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Customer List Data Table */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-950/60 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                        <th className="px-6 py-4 font-bold">Customer Info</th>
                        <th className="px-6 py-4 font-bold">Phone Number</th>
                        <th className="px-6 py-4 font-bold text-center">Total Bookings</th>
                        <th className="px-6 py-4 font-bold text-right">Total Amount Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/40 text-sm">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                            <div className="max-w-sm mx-auto space-y-2">
                              <p className="text-sm font-semibold text-slate-400">No Customers Found</p>
                              <p className="text-xs text-slate-500">Customer profiles will appear automatically here as new ride bookings are created.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        users.map((u, idx) => (
                          <tr 
                            key={idx} 
                            className="hover:bg-slate-900/30 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-400 flex items-center justify-center group-hover:border-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                  {u.guestName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-200 group-hover:text-white transition-colors block">{u.guestName}</span>
                                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Registered Client</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                              {u.guestPhone}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-800 rounded text-xs font-mono font-medium text-slate-300">
                                {u.totalBookings}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-slate-200 font-mono text-xs">
                              ₹{u.totalSpent.toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  )
}