'use client'
import { useState } from 'react'
import OtpSection from '@/components/OtpSection'
import LocationInput from '@/components/LocationInput'
import FareResult from '@/components/FareResult'
import { LocationResult } from '@/hooks/useLocationSearch'
import { useRouter } from "next/navigation"

const RIDE_TYPES = [
  { name: 'Mini', rate: 12, icon: '🚗', color: '#facc15', desc: 'Economy' },
  { name: 'Sedan', rate: 16, icon: '🚙', color: '#38bdf8', desc: 'Comfort' },
  { name: 'SUV', rate: 22, icon: '🚐', color: '#a78bfa', desc: 'Spacious' },
  { name: 'Prime', rate: 18, icon: '⭐', color: '#f472b6', desc: 'Premium' },
  { name: 'Luxury', rate: 25, icon: '💎', color: '#34d399', desc: 'Elite' },
  { name: 'Airport', rate: 28, icon: '✈️', color: '#fb923c', desc: 'Transfer' },
]

interface RouteResult {
  distKm: number
  durationMin: number
}

export default function BookingPage() {
  const router = useRouter()
  const [otpVerified, setOtpVerified] = useState(false)
  const [pickupText, setPickupText] = useState('')
  const [dropoffText, setDropoffText] = useState('')
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedRide, setSelectedRide] = useState(0)
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [calcLoading, setCalcLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'ok' | 'err' } | null>(null)

  function showMsg(text: string, type: 'ok' | 'err') {
    setStatusMsg({ text, type })
    setTimeout(() => setStatusMsg(null), 5000)
  }

  async function gpsPickup() {
    if (!navigator.geolocation) { showMsg('GPS not available', 'err'); return }
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude: lat, longitude: lon } = pos.coords
      try {
        const res = await fetch(`/api/geocode?action=reverse&lat=${lat}&lon=${lon}`)
        const data = await res.json()
        setPickupText(data.label)
        setPickupCoords({ lat, lon })
      } catch {
        setPickupText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`)
        setPickupCoords({ lat, lon })
      }
    }, () => showMsg('GPS access denied', 'err'))
  }

  async function calcFare() {
    if (!pickupText || !dropoffText) { showMsg('Enter both pickup and drop-off', 'err'); return }
    let pc = pickupCoords
    let dc = dropoffCoords
    if (!pc) {
      const r = await fetch(`/api/geocode?action=suggest&q=${encodeURIComponent(pickupText)}`)
      const d = await r.json()
      if (!d.length) { showMsg('Pickup location not found', 'err'); return }
      pc = { lat: d[0].lat, lon: d[0].lon }
      setPickupCoords(pc)
    }
    if (!dc) {
      const r = await fetch(`/api/geocode?action=suggest&q=${encodeURIComponent(dropoffText)}`)
      const d = await r.json()
      if (!d.length) { showMsg('Drop-off location not found', 'err'); return }
      dc = { lat: d[0].lat, lon: d[0].lon }
      setDropoffCoords(dc)
    }
    setCalcLoading(true)
    setRouteResult(null)
    try {
      const url = `/api/geocode?action=route&plat=${pc.lat}&plon=${pc.lon}&dlat=${dc.lat}&dlon=${dc.lon}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setRouteResult({ distKm: data.distanceKm, durationMin: data.durationMin })
    } catch {
      showMsg('Could not get route. Try full location names.', 'err')
    }
    setCalcLoading(false)
  }

  async function createBooking() {
    if (!otpVerified) { showMsg('Please verify customer OTP first', 'err'); return }
    if (!pickupText || !dropoffText) { showMsg('Enter pickup and drop-off locations', 'err'); return }
    if (!routeResult) { showMsg('Calculate fare first', 'err'); return }
    const user = JSON.parse(localStorage.getItem("auto-ride-user") || "{}")
    const bookingData = {
      guestName: user.name || "Customer",
      guestEmail: user.email || "customer@gmail.com",
      mobileNumber: user.mobileNumber || "9876543210",
      pickupLocation: pickupText,
      dropoffLocation: dropoffText,
      rideType: ride.name,
      travelDate: new Date().toISOString(),
      estimatedDistanceKm: routeResult.distKm,
      paymentMethod: "ONLINE",
      paymentAmount: routeResult.distKm * ride.rate,
      notes: "",
      status: "PENDING",
    }
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })
      if (!res.ok) throw new Error('Booking failed')
      const data = await res.json()
      showMsg(`✓ Booking confirmed! Reference: ${data.booking.id}`, 'ok')
      router.push("/")
      window.dispatchEvent(new Event("booking-created"))
      router.refresh()
    } catch {
      showMsg('Booking failed', 'err')
    }
  }

  const ride = RIDE_TYPES[selectedRide]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #08090d 0%, #0d1b2a 50%, #08090d 100%)',
      padding: '2rem 1rem',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)',
      }} />

      <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '999px', padding: '0.2rem 0.75rem', marginBottom: '1rem',
            fontSize: '0.7rem', fontWeight: 600, color: '#D4AF37', letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />
            New Ride
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Reserve your ride
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Enter route, verify OTP, get instant fare estimate
          </p>
        </div>

        {/* OTP Section */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '0.75rem' }}>
            📱 Verify Mobile
          </p>
          <OtpSection onVerified={() => setOtpVerified(true)} />
          {otpVerified && (
            <div style={{
              marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.8rem', color: '#34d399',
              background: 'rgba(52,211,153,0.1)', borderRadius: '8px', padding: '0.4rem 0.75rem',
            }}>
              <span>✓</span> Mobile verified
            </div>
          )}
        </div>

        {/* Route */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '1rem' }}>
            📍 Route
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <LocationInput
              id="pickup"
              placeholder="Pickup location"
              value={pickupText}
              onChange={(v: string) => { setPickupText(v); setPickupCoords(null) }}
              onSelect={(loc: LocationResult) => { setPickupCoords({ lat: loc.lat, lon: loc.lon }); setPickupText(loc.label) }}
              dotColor="#4ECDC4"
              onGps={gpsPickup}
              actionLabel="📡 GPS"
            />
            <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.1)', marginLeft: '7px' }} />
            <LocationInput
              id="dropoff"
              placeholder="Drop-off location"
              value={dropoffText}
              onChange={(v: string) => { setDropoffText(v); setDropoffCoords(null) }}
              onSelect={(loc: LocationResult) => { setDropoffCoords({ lat: loc.lat, lon: loc.lon }); setDropoffText(loc.label) }}
              dotColor="#f97316"
              actionLabel="✕ Clear"
              onAction={() => { setDropoffText(''); setDropoffCoords(null) }}
            />
          </div>
        </div>

        {/* Ride Type */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '1rem' }}>
            🚗 Ride type
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {RIDE_TYPES.map((rt, i) => (
              <button
                key={rt.name}
                type="button"
                onClick={() => { setSelectedRide(i); setRouteResult(null) }}
                style={{
                  borderRadius: '12px', padding: '0.85rem 0.5rem', textAlign: 'center',
                  background: i === selectedRide ? `rgba(${rt.color === '#facc15' ? '250,204,21' : rt.color === '#38bdf8' ? '56,189,248' : rt.color === '#a78bfa' ? '167,139,250' : rt.color === '#f472b6' ? '244,114,182' : rt.color === '#34d399' ? '52,211,153' : '251,146,60'},0.1)` : 'rgba(255,255,255,0.03)',
                  border: i === selectedRide ? `1px solid ${rt.color}` : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{rt.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: i === selectedRide ? rt.color : '#9ca3af' }}>{rt.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.1rem' }}>₹{rt.rate}/km</div>
                <div style={{ fontSize: '0.65rem', color: i === selectedRide ? rt.color : '#4b5563', marginTop: '0.15rem' }}>{rt.desc}</div>
              </button>
            ))}
          </div>

          {/* Selected ride summary */}
          <div style={{
            marginTop: '1rem', padding: '0.75rem 1rem',
            background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
            border: `1px solid ${ride.color}33`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{ride.icon} {ride.name} selected</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: ride.color }}>₹{ride.rate}/km</span>
          </div>
        </div>

        {/* Schedule & Extras */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem',
        }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '1rem' }}>
            📅 Schedule & extras
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }}>Travel date & time</label>
              <input type="datetime-local" style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                padding: '0.5rem 0.6rem', color: '#f0f0f0', fontSize: '0.8rem',
                outline: 'none',
              }} />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }}>Payment method</label>
              <select style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                padding: '0.5rem 0.6rem', color: '#f0f0f0', fontSize: '0.8rem',
                outline: 'none',
              }}>
                <option style={{ background: '#0d1b2a' }}>Online payment</option>
                <option style={{ background: '#0d1b2a' }}>Cash</option>
                <option style={{ background: '#0d1b2a' }}>UPI</option>
                <option style={{ background: '#0d1b2a' }}>Card</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }}>Extra notes</label>
            <textarea
              placeholder="Luggage, special needs, etc."
              rows={2}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                padding: '0.6rem 0.75rem', color: '#f0f0f0', fontSize: '0.8rem',
                outline: 'none', resize: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Estimate Button */}
        <button
          type="button"
          onClick={calcFare}
          disabled={calcLoading}
          style={{
            width: '100%', padding: '0.9rem',
            borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700,
            border: '1px solid rgba(78,205,196,0.4)',
            color: calcLoading ? '#4b5563' : '#4ECDC4',
            background: calcLoading ? 'rgba(255,255,255,0.03)' : 'rgba(78,205,196,0.08)',
            cursor: calcLoading ? 'not-allowed' : 'pointer',
            marginBottom: '1rem', transition: 'all 0.2s', letterSpacing: '-0.01em',
          }}
        >
          {calcLoading ? '⏳ Fetching real route...' : '🗺️ Estimate distance & fare'}
        </button>

        {/* Fare Result */}
        {routeResult && (
          <div style={{ marginBottom: '1rem' }}>
            <FareResult
              pickup={pickupText}
              dropoff={dropoffText}
              distKm={routeResult.distKm}
              durationMin={routeResult.durationMin}
              rate={ride.rate}
              rideName={ride.name}
            />
          </div>
        )}

        {/* Status Message */}
        {statusMsg && (
          <div style={{
            fontSize: '0.85rem', textAlign: 'center',
            padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1rem',
            background: statusMsg.type === 'ok' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
            color: statusMsg.type === 'ok' ? '#34d399' : '#f87171',
            border: `1px solid ${statusMsg.type === 'ok' ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
          }}>
            {statusMsg.text}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="button"
          onClick={createBooking}
          style={{
            width: '100%', padding: '1rem', borderRadius: '14px',
            fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #D4AF37 0%, #facc15 100%)',
            color: '#08090d', border: 'none', cursor: 'pointer',
            boxShadow: '0 0 28px rgba(212,175,55,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(212,175,55,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(212,175,55,0.3)')}
        >
          ✓ Create Booking
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#4b5563', marginTop: '1rem' }}>
          Fare is locked once booking is confirmed
        </p>
      </div>
    </div>
  )
}