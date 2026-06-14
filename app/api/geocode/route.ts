import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    if (action === 'suggest') {
      const q = searchParams.get('q')
      if (!q || q.length < 2) return NextResponse.json([])

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`,
        { headers: { 'User-Agent': 'RideBookingApp' } }
      )
      const data = await res.json()

      return NextResponse.json(
        data.map((item: any) => ({
          label: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }))
      )
    }

    if (action === 'reverse') {
      const lat = searchParams.get('lat')
      const lon = searchParams.get('lon')

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { 'User-Agent': 'RideBookingApp' } }
      )
      const data = await res.json()

      return NextResponse.json({
        label: data.address?.city || data.address?.town || data.display_name || `${lat}, ${lon}`,
      })
    }

    if (action === 'route') {
      const plat = searchParams.get('plat')
      const plon = searchParams.get('plon')
      const dlat = searchParams.get('dlat')
      const dlon = searchParams.get('dlon')

      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${plon},${plat};${dlon},${dlat}?overview=false`,
        { headers: { 'User-Agent': 'RideBookingApp' } }
      )
      const data = await res.json()

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        return NextResponse.json({
          distanceKm: route.distance / 1000,
          durationMin: Math.round(route.duration / 60),
        })
      }

      return NextResponse.json({ error: 'No route found' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Geocoding error:', err)
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 })
  }
}
