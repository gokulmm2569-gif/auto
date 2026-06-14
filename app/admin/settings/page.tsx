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
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.6s ease-out 0.2s; }
        .animate-fade-in-delay2 { animation: fade-in 0.6s ease-out 0.4s; }
        .animate-slide-down { animation: slide-down 0.5s ease-out; }
        .animate-scale-in { animation: scale-in 0.5s ease-out; }
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
                <div className="text-4xl animate-icon-bounce">⚙️</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f97316] to-[#4ECDC4] bg-clip-text text-transparent">
                  Settings
                </h1>
              </div>
              <p className="text-sm text-[#4ECDC4] mt-2 font-medium">
                Manage your admin profile and view stats ✨
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
        <div className="max-w-3xl mx-auto px-6 py-8 relative space-y-6">
          {/* Admin Profile Card */}
          <div className="rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#4ECDC4]/30 transition-all duration-300 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl animate-icon-bounce">👤</div>
              <h2 className="text-xl font-bold text-white">Admin Profile</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#1e3a5f]">
                <span className="text-[#8a9bb5] font-medium flex items-center gap-2">
                  <span className="text-[#4ECDC4]">📛</span>
                  Name
                </span>
                <span className="text-white font-semibold text-lg">{user.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#1e3a5f]">
                <span className="text-[#8a9bb5] font-medium flex items-center gap-2">
                  <span className="text-[#34d399]">📧</span>
                  Email
                </span>
                <span className="text-white font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[#8a9bb5] font-medium flex items-center gap-2">
                  <span className="text-[#f97316]">🎭</span>
                  Role
                </span>
                <span className="rounded-full bg-gradient-to-r from-[#064e3b] to-[#065f46] px-4 py-2 text-xs text-[#34d399] font-semibold shadow-lg shadow-[#34d399]/20">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Summary Card */}
          <div className="rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#34d399]/30 transition-all duration-300 animate-fade-in-delay">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl animate-icon-bounce">💰</div>
              <h2 className="text-xl font-bold text-white">Revenue Summary</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[#1e3a5f]">
                <span className="text-[#8a9bb5] font-medium flex items-center gap-2">
                  <span className="text-[#4ECDC4]">💳</span>
                  Online Payments
                </span>
                <span className="text-[#34d399] font-bold text-lg">₹{stats.onlinePaymentTotalCash}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#1e3a5f]">
                <span className="text-[#8a9bb5] font-medium flex items-center gap-2">
                  <span className="text-[#f97316]">💵</span>
                  Offline Payments
                </span>
                <span className="text-[#34d399] font-bold text-lg">₹{stats.offlinePaymentTotalCash}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-gradient-to-r from-[#0a3a3a] to-[#0a4a4a] rounded-xl px-4">
                <span className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="text-[#34d399]">🏆</span>
                  Total Revenue
                </span>
                <span className="text-[#34d399] font-bold text-2xl">₹{stats.onlinePaymentTotalCash + stats.offlinePaymentTotalCash}</span>
              </div>
            </div>
          </div>

          {/* Booking Summary Card */}
          <div className="rounded-2xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-8 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#4ECDC4]/30 transition-all duration-300 animate-fade-in-delay2">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl animate-icon-bounce">📊</div>
              <h2 className="text-xl font-bold text-white">Booking Summary</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-gradient-to-br from-[#0a3a3a] to-[#0a4a4a] p-4 text-center transform hover:scale-110 transition-all">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-[#8a9bb5] text-xs font-medium">Total</p>
                <p className="text-2xl font-bold text-[#4ECDC4] mt-1">{stats.total}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-[#0a3a3a] to-[#0a4a4a] p-4 text-center transform hover:scale-110 transition-all">
                <div className="text-3xl mb-2">✅</div>
                <p className="text-[#8a9bb5] text-xs font-medium">Confirmed</p>
                <p className="text-2xl font-bold text-[#34d399] mt-1">{stats.confirmed}</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-[#0a3a3a] to-[#0a4a4a] p-4 text-center transform hover:scale-110 transition-all">
                <div className="text-3xl mb-2">⏳</div>
                <p className="text-[#8a9bb5] text-xs font-medium">Pending</p>
                <p className="text-2xl font-bold text-[#f97316] mt-1">{stats.pending}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#8a9bb5] text-sm">Completion Rate</span>
                <span className="text-[#4ECDC4] font-bold text-sm">
                  {stats.total === 0 ? '0%' : `${Math.round((stats.confirmed / stats.total) * 100)}%`}
                </span>
              </div>
              <div className="w-full h-3 bg-[#1e3a5f] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#34d399] to-[#4ECDC4] rounded-full transition-all duration-500"
                  style={{ width: `${stats.total === 0 ? 0 : (stats.confirmed / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            <div className="rounded-xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-6 transform hover:scale-105 hover:shadow-xl hover:shadow-[#34d399]/20 transition-all">
              <div className="text-2xl mb-2">👥</div>
              <p className="text-[#8a9bb5] text-sm">Online Members</p>
              <p className="text-2xl font-bold text-[#34d399] mt-1">{stats.onlinePaymentMembersTotal}</p>
            </div>
            <div className="rounded-xl border border-[#1e3a5f] bg-gradient-to-br from-[#082020] to-[#0a3a4a] p-6 transform hover:scale-105 hover:shadow-xl hover:shadow-[#f97316]/20 transition-all">
              <div className="text-2xl mb-2">👤</div>
              <p className="text-[#8a9bb5] text-sm">Offline Members</p>
              <p className="text-2xl font-bold text-[#f97316] mt-1">{stats.offlineMembersTotal}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group w-full rounded-2xl bg-gradient-to-r from-[#4c0519] to-[#6b0f28] py-4 text-[#f87171] font-semibold text-lg hover:from-[#6b0f28] hover:to-[#8a1c3a] transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#f87171]/50 animate-fade-in"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="group-hover:translate-x-1 transition-transform">🚪</span>
              Logout
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>
      </div>
    </>
  )
}