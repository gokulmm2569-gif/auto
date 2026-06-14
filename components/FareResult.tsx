interface Props {
  pickup: string
  dropoff: string
  distKm: number
  durationMin: number
  rate: number
  rideName: string
}

export default function FareResult({ pickup, dropoff, distKm, durationMin, rate, rideName }: Props) {
  const base = Math.round(distKm * rate)
  const platform = 30
  const hour = new Date().getHours()
  const nightCharge = hour >= 22 || hour < 6 ? Math.round(base * 0.2) : 0
  const total = base + platform + nightCharge
  const hrs = Math.floor(durationMin / 60)
  const mins = durationMin % 60
  const durStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`

  return (
    <div className="rounded-xl p-4 mb-3 bg-[#082020] border border-[#4ECDC4]">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-bold mb-4 bg-[#0a3a3a] text-[#4ECDC4] border border-[#4ECDC4]">
        📏 {distKm.toFixed(1)} km by road
      </div>

      <div className="space-y-2 text-sm">
        {[
          { label: '📍 Pickup', val: pickup },
          { label: '🏁 Drop-off', val: dropoff },
          { label: '📏 Distance', val: `${distKm.toFixed(1)} km` },
          { label: '⏱ Drive time', val: durStr },
          { label: '🚗 Rate', val: `₹${rate}/km (${rideName})` },
          { label: '🧾 Base fare', val: `₹${base}` },
          { label: '🏷 Platform fee', val: `₹${platform}` },
          { label: '🌙 Night surcharge', val: nightCharge > 0 ? `₹${nightCharge} (10pm–6am)` : 'None' },
        ].map(row => (
          <div key={row.label} className="flex justify-between items-start">
            <span className="text-[#8a9bb5]">{row.label}</span>
            <span className="text-right ml-4 text-white text-xs" style={{ maxWidth: '200px' }}>
              {row.val}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3 mt-2 border-t border-[#1e3a5f]">
          <span className="font-semibold text-[#cdd9e5]">Total estimate</span>
          <span className="text-2xl font-bold text-[#4ECDC4]">₹{total}</span>
        </div>
      </div>
    </div>
  )
}
