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

  // Calculated Stats Variables
  const totalRevenue = bookings.reduce((sum, b) => sum + b.paymentAmount, 0)
  const confirmedCount = bookings.filter(b => b.status.toUpperCase() === 'CONFIRMED').length
  const pendingCount = bookings.filter(b => b.status.toUpperCase() === 'PENDING').length
  const cancelledCount = bookings.filter(b => b.status.toUpperCase() === 'CANCELLED').length

  if (loading) return (
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
        <h2 className="text-white text-base font-bold tracking-wide animate-pulse">Loading Bookings List...</h2>
        <p className="text-slate-400 text-xs mt-1">Retrieving system transactions</p>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @keyframes ambient-glow {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.05; }
          50% { transform: translateY(-20px) scale(1.05); opacity: 0.08; }
        }
        @keyframes laser-slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-ambient { animation: ambient-glow 8s ease-in-out infinite; }
        .animate-ambient-delayed { animation: ambient-glow 6s ease-in-out infinite; animation-delay: 2s; }
        .laser-glow:hover::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 2px;
          background: linear-gradient(to right, transparent, #f59e0b, transparent);
          animation: laser-slide 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-[#040814] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 antialiased">
        
        {/* Dynamic Canvas Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[5%] w-[700px] h-[700px] bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-[130px] animate-ambient" />
          <div className="absolute bottom-[-5%] right-[5%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/8 to-transparent rounded-full blur-[130px] animate-ambient-delayed" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black_80%)]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          
          {/* Main Top Header Block */}
          <header className="border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-2xl px-6 lg:px-12 py-5 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-5 justify-between sm:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold tracking-tight text-white">All Bookings</h1>
                  <span className="text-[11px] font-bold bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Live Ledger
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">Comprehensive system transaction feed</p>
              </div>

              <Link
                href="/admin/dashboard"
                className="group rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 px-5 py-2.5 text-sm font-bold text-slate-200 transition-all duration-300 flex items-center gap-2.5 shadow-md"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
                Back to Dashboard
              </Link>
            </div>
          </header>

          {/* Split Workspace Layout */}
          <main className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* STICKY SIDE PANEL: Quick Metrics Summary Desk */}
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Financial Ledger Summary</h3>
                  
                  <div className="mb-6">
                    <span className="text-xs text-slate-400 block mb-1">Total Gross Revenue</span>
                    <div className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="h-px bg-slate-800/60 my-5" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800/50 p-3 rounded-xl">
                      <span className="text-sm text-slate-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" /> Total Bookings
                      </span>
                      <span className="text-sm font-bold text-white">{bookings.length}</span>
                    </div>

                    <div className="flex justify-between items-center bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                      <span className="text-sm text-emerald-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Confirmed
                      </span>
                      <span className="text-sm font-bold text-emerald-400">{confirmedCount}</span>
                    </div>

                    <div className="flex justify-between items-center bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl">
                      <span className="text-sm text-amber-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Pending Reviews
                      </span>
                      <span className="text-sm font-bold text-amber-400">{pendingCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC LIST PANEL: Grid Cards Feed Split */}
              <div className="lg:col-span-2 space-y-4">
                {bookings.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-20 text-center text-slate-500 backdrop-blur-xl">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 mb-4 text-slate-400 text-xl font-bold">
                      ✕
                    </div>
                    <span className="text-base tracking-wide block text-slate-300 font-bold">No active requests logged</span>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Incoming reservations submitted by users will display here instantly in real-time order.</p>
                  </div>
                ) : (
                  bookings.map((row: Booking) => (
                    <div
                      key={row.id}
                      className="group relative rounded-2xl border border-slate-800/80 bg-slate-950/30 hover:bg-slate-900/30 backdrop-blur-xl p-6 transition-all duration-300 shadow-lg overflow-hidden laser-glow"
                    >
                      {/* Top Header Row Inside Card */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase block mb-1">
                            ID: #{row.id.toUpperCase()}
                          </span>
                          <h4 className="text-lg font-bold text-white tracking-tight">
                            {row.guestName}
                          </h4>
                        </div>

                        {/* Status Stamp Badge */}
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border shadow-sm ${
                          row.status.toUpperCase() === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.04)]'
                            : row.status.toUpperCase() === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.04)]'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            row.status.toUpperCase() === 'CONFIRMED' ? 'bg-emerald-400 animate-pulse' : row.status.toUpperCase() === 'PENDING' ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'
                          }`} />
                          {row.status.toLowerCase()}
                        </span>
                      </div>

                      {/* Route Map Blocks Graph */}
                      <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-inner">
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Pickup</span>
                          <div className="text-sm font-semibold text-slate-200">{row.pickupLocation}</div>
                        </div>
                        <div className="hidden md:block text-slate-700 font-black text-lg select-none">→</div>
                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">Dropoff</span>
                          <div className="text-sm font-semibold text-slate-400">{row.dropoffLocation}</div>
                        </div>
                      </div>

                      {/* Footer Metadata & Pricing */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                        <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800/60">
                          <span>{row.paymentMethod === 'online' ? '💳' : row.paymentMethod === 'offline' ? '💵' : '📝'}</span>
                          <span className="capitalize font-medium">{row.paymentMethod || 'Unassigned'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">Fare Amount</span>
                          <span className="text-xl font-black text-emerald-400 tracking-tight">
                            ₹{row.paymentAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  )
}