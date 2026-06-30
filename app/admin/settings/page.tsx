'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Stats {
  total: number
  confirmed: number
  pending: number
  onlinePaymentTotalCash: number
  offlinePaymentTotalCash: number
  onlinePaymentMembersTotal: number
  offlineMembersTotal: number
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
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
        if (data.ok) setStats(data.stats)
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auto-ride-user')
    router.push('/admin/login')
  }

  if (!user) return null

  const completionRate = stats.total === 0 ? 0 : Math.round((stats.confirmed / stats.total) * 100)

  return (
    <>
      <style>{`
        @keyframes subtle-drift {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.03; }
          50% { transform: translateY(-15px) scale(1.05); opacity: 0.06; }
        }
        .animate-drift-slow { animation: subtle-drift 10s ease-in-out infinite; }
        .animate-drift-fast { animation: subtle-drift 7s ease-in-out infinite; animation-delay: 2.5s; }
      `}</style>

      <div className="min-h-screen bg-[#030712] text-slate-200 antialiased selection:bg-amber-500/20 relative overflow-x-hidden">
        
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] animate-drift-slow" />
          <div className="absolute bottom-[5%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] animate-drift-fast" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen font-sans">
          
          {/* Top Navigation Bar */}
          <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md px-6 py-4 sticky top-0 z-50 shadow-md">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-xl font-bold tracking-tight text-white uppercase">
                  Account Settings
                </h1>
                <p className="text-sm text-slate-400 font-normal mt-0.5">Manage your profile and track business performance</p>
              </div>

              <Link
                href="/admin/dashboard"
                className="px-5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <span>←</span> Go to Dashboard
              </Link>
            </div>
          </header>

          <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* LEFT COLUMN: Profile Info Card */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-xl font-extrabold text-slate-900 shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Administrator</h3>
                    <p className="text-xs text-slate-400 font-medium italic">Active Session</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/60">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Full Name</p>
                    <p className="text-base font-semibold text-slate-100">{user.name}</p>
                  </div>
                  
                  <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/60">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Email Address</p>
                    <p className="text-sm font-medium text-slate-300 break-all font-mono">{user.email}</p>
                  </div>

                  <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10 flex justify-between items-center">
                    <p className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">Role Hierarchy</p>
                    <span className="px-3 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-bold text-xs uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-900/50 text-rose-400 py-3.5 text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 tracking-wide"
              >
                Logout Account <span>→</span>
              </button>
            </div>

            {/* RIGHT COLUMN: Performance & Accounting Metrics */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Earnings Section */}
              <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-950/40 p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Total Earnings</p>
                <h3 className="text-3xl font-black text-white tracking-tight mb-4">
                  ₹{(stats.onlinePaymentTotalCash + stats.offlinePaymentTotalCash).toLocaleString('en-IN')}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/60">
                  <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/60">
                    <p className="text-xs font-medium text-slate-400 mb-1">Online Payments</p>
                    <p className="text-lg font-bold text-slate-200">₹{stats.onlinePaymentTotalCash.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-950/30 p-4 rounded-xl border border-slate-800/60">
                    <p className="text-xs font-medium text-slate-400 mb-1">Cash Payments</p>
                    <p className="text-lg font-bold text-slate-200">₹{stats.offlinePaymentTotalCash.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Booking Ledger Summary */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 shadow-lg">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Booking Summary</h4>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80 text-center">
                    <p className="text-xl font-bold text-white mb-0.5">{stats.total}</p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total Trips</p>
                  </div>
                  <div className="bg-slate-950/40 p-3.5 rounded-xl border border-emerald-950 text-center">
                    <p className="text-xl font-bold text-emerald-400 mb-0.5">{stats.confirmed}</p>
                    <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Success</p>
                  </div>
                  <div className="bg-slate-950/40 p-3.5 rounded-xl border border-amber-950 text-center">
                    <p className="text-xl font-bold text-amber-500 mb-0.5">{stats.pending}</p>
                    <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Waitlist</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-xs">
                    <p className="font-semibold text-slate-300">Success Rate</p>
                    <p className="font-bold text-emerald-400 font-mono">{completionRate}%</p>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/50 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* User Groups Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xl font-bold text-white">{stats.onlinePaymentMembersTotal}</p>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Digital Members</p>
                  </div>
                  <div className="text-2xl opacity-80">💳</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xl font-bold text-white">{stats.offlineMembersTotal}</p>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Cash Members</p>
                  </div>
                  <div className="text-2xl opacity-80">💰</div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  )
}