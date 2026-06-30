'use client'
import { useState } from 'react'
import OtpSection from '@/components/OtpSection'
import LocationInput from '@/components/LocationInput'
import FareResult from '@/components/FareResult'
import { LocationResult } from '@/hooks/useLocationSearch'
import { useRouter } from "next/navigation"

const RIDE_TYPES = [
  { name: 'Mini', rate: 12, icon: '🚗', color: '250, 204, 21', desc: 'Economy' },
  { name: 'Sedan', rate: 16, icon: '🚙', color: '56, 189, 248', desc: 'Comfort' },
  { name: 'SUV', rate: 22, icon: '🚐', color: '167, 139, 250', desc: 'Spacious' },
  { name: 'Prime', rate: 18, icon: '⭐', color: '244, 114, 182', desc: 'Premium' },
  { name: 'Luxury', rate: 25, icon: '💎', color: '52, 211, 153', desc: 'Elite' },
  { name: 'Airport', rate: 28, icon: '✈️', color: '251, 146, 60', desc: 'Transfer' },
]

interface RouteResult {
  distKm: number
  durationMin: number
}

export default function BookingPage() {
  const router = useRouter()
  const [otpVerified, setOtpVerified] = useState(false)
  const [mobileNumber, setMobileNumber] = useState('') // OTP வெரிஃபிகேஷனில் இருந்து மொபைல் எண்ணைச் சேமிக்க ஸ்டேட்
  const [pickupText, setPickupText] = useState('')
  const [dropoffText, setDropoffText] = useState('')
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [selectedRide, setSelectedRide] = useState(0)
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [calcLoading, setCalcLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'ok' | 'err' } | null>(null)

  // தேர்ந்தெடுக்கப்பட்ட வண்டியின் விவரங்கள் (ஸ்கோப் எரர் வராமல் இருக்க மேலே மாற்றப்பட்டுள்ளது)
  const ride = RIDE_TYPES[selectedRide]

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
      mobileNumber: mobileNumber || user.mobileNumber || "9876543210", // OTP-யில் இருந்து பெறப்பட்ட எண் இங்கு இணையும்
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

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0f19',
      backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(15, 23, 42, 1) 0%, rgba(11, 15, 25, 1) 90%)',
      padding: '2rem 1.5rem',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: '#f3f4f6',
      boxSizing: 'border-box'
    }}>
      {/* Structural layout handler */}
      <div style={{ 
        maxWidth: '1350px', 
        margin: '0 auto', 
        display: 'grid',
        gridTemplateColumns: 'grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))', // Mobile fallback
        gap: '2.5rem',
        alignItems: 'start',
      }} className="desktop-layout-grid">
        
        {/* LEFT COLUMN: Map Dynamic Interaction Graphic Panel */}
        <div style={{
          position: 'sticky',
          top: '2rem',
          background: 'rgba(15, 23, 42, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '24px',
          height: 'calc(100vh - 4rem)',
          minHeight: '450px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}>
          {/* Mock Interactive Map Backdrop */}
          <div style={{ 
            flex: 1, 
            background: '#0f172a',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Ambient decorative center trace glow */}
            <div style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: `rgba(${ride.color}, 0.05)`,
              filter: 'blur(40px)',
              transition: 'background 0.5s ease'
            }} />
            
            <div style={{ textAlign: 'center', zIndex: 1, padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🗺️</div>
              <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '1rem' }}>Live Route Geolocation Map</div>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', maxWidth: '280px', margin: '0.4rem auto 0' }}>
                {pickupText && dropoffText ? 'Processing dynamic routing vectors...' : 'Awaiting entry of starting parameters and target destination...'}
              </p>
            </div>

            {/* Bottom Floating Card inside Map side */}
            {routeResult && (
              <div style={{
                position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem',
                background: 'rgba(11, 15, 25, 0.9)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1rem',
                display: 'flex', justifyContent: 'space-around', alignItems: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Est. Distance</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{routeResult.distKm} km</div>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Est. Duration</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{routeResult.durationMin} mins</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Booking Form Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Header context */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '999px', padding: '0.35rem 1rem', marginBottom: '0.75rem',
              fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.05em',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: `rgb(${ride.color})`, display: 'inline-block' }} />
              Premium Dispatch Engine
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>
              Reserve Your Ride
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Complete the credentials, choose an option, and calculate metrics.
            </p>
          </div>

          {/* Verification Card */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(12px)',
            border: otpVerified ? '1px solid rgba(52, 211, 153, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px', padding: '1.25rem', boxSizing: 'border-box'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '0.75rem' }}>
              📱 Verification Status
            </p>
            <OtpSection onVerified={(phone: string) => { setOtpVerified(true); setMobileNumber(phone); }} />
            {otpVerified && (
              <div style={{
                marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                fontSize: '0.8rem', color: '#34d399', background: 'rgba(52,211,153,0.06)', borderRadius: '10px', padding: '0.5rem 0.75rem',
              }}>
                ✓ Mobile token successfully authenticated: {mobileNumber}
              </div>
            )}
          </div>

          {/* Route Config Card */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '1.25rem', boxSizing: 'border-box'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '1rem' }}>
              📍 Journey Parameters
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <LocationInput
                id="pickup"
                placeholder="Pickup terminal location"
                value={pickupText}
                onChange={(v: string) => { setPickupText(v); setPickupCoords(null) }}
                onSelect={(loc: LocationResult) => { setPickupCoords({ lat: loc.lat, lon: loc.lon }); setPickupText(loc.label) }}
                dotColor="#38bdf8"
                onGps={gpsPickup}
                actionLabel="📡 GPS"
              />
              <div style={{ width: '2px', height: '16px', background: 'linear-gradient(#38bdf8, #f97316)', marginLeft: '16px', opacity: 0.3 }} />
              <LocationInput
                id="dropoff"
                placeholder="Drop-off point"
                value={dropoffText}
                onChange={(v: string) => { setDropoffText(v); setDropoffCoords(null) }}
                onSelect={(loc: LocationResult) => { setDropoffCoords({ lat: loc.lat, lon: loc.lon }); setDropoffText(loc.label) }}
                dotColor="#f97316"
                actionLabel="✕ Clear"
                onAction={() => { setDropoffText(''); setDropoffCoords(null) }}
              />
            </div>
          </div>

          {/* Fleets Selection Grid */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '1.25rem', boxSizing: 'border-box'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '1rem' }}>
              🚕 Fleet Tier Options
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {RIDE_TYPES.map((rt, i) => {
                const isSelected = i === selectedRide;
                return (
                  <button
                    key={rt.name}
                    type="button"
                    onClick={() => { setSelectedRide(i); setRouteResult(null) }}
                    style={{
                      borderRadius: '16px', padding: '1rem', textAlign: 'left',
                      background: isSelected ? `rgba(${rt.color}, 0.08)` : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? `2px solid rgb(${rt.color})` : '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      outline: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span style={{ fontSize: '1.4rem' }}>{rt.icon}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? `rgb(${rt.color})` : '#9ca3af' }}>₹{rt.rate}/km</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginTop: '0.25rem' }}>{rt.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{rt.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Extras / Logistics Option Card */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '20px', padding: '1.25rem', boxSizing: 'border-box'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#4ECDC4', marginBottom: '1rem' }}>
              📅 Logistical Schedule
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>Date & Time</label>
                <input type="datetime-local" style={{
                  width: '100%', background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px',
                  padding: '0.6rem', color: '#ffffff', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box'
                }} />
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>Payment Strategy</label>
                <select style={{
                  width: '100%', background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px',
                  padding: '0.6rem', color: '#ffffff', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', height: '37px'
                }}>
                  <option style={{ background: '#0b0f19' }}>Online Wallet</option>
                  <option style={{ background: '#0b0f19' }}>Cash On Delivery</option>
                  <option style={{ background: '#0b0f19' }}>UPI Handle</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block', marginBottom: '0.4rem' }}>Special Driver Instructions</label>
              <textarea placeholder="Add details like luggage count, landmarks, or accessibility options..." rows={2} style={{
                width: '100%', background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px',
                padding: '0.6rem', color: '#ffffff', fontSize: '0.8rem', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
              }} />
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <button
            type="button"
            onClick={calcFare}
            disabled={calcLoading}
            style={{
              width: '100%', padding: '1rem', borderRadius: '16px', fontSize: '0.9rem', fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.08)', color: calcLoading ? '#4b5563' : '#ffffff',
              background: calcLoading ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
              cursor: calcLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            }}
          >
            {calcLoading ? 'Syncing navigation array matrix...' : '🗺️ Estimate Distance & Fares'}
          </button>

          {routeResult && (
            <FareResult
              pickup={pickupText}
              dropoff={dropoffText}
              distKm={routeResult.distKm}
              durationMin={routeResult.durationMin}
              rate={ride.rate}
              rideName={ride.name}
            />
          )}

          {statusMsg && (
            <div style={{
              fontSize: '0.85rem', padding: '1rem', borderRadius: '14px',
              background: statusMsg.type === 'ok' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
              color: statusMsg.type === 'ok' ? '#34d399' : '#f87171',
              border: `1px solid ${statusMsg.type === 'ok' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
            }}>
              {statusMsg.text}
            </div>
          )}

          <button
            type="button"
            onClick={createBooking}
            style={{
              width: '100%', padding: '1.1rem', borderRadius: '16px',
              fontSize: '1rem', fontWeight: 800, background: '#ffffff', color: '#0b0f19',
              border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,255,255,0.1)',
              transition: 'all 0.2s'
            }}
          >
            ✓ Complete Reservation Request
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 900px) {
          .desktop-layout-grid {
            grid-template-columns: 1.1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}