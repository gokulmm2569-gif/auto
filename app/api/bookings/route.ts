import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const email = searchParams.get('email') ?? ''
  const bookings = db.listBookings(email)
  const stats = db.getDashboardStats(email)

  return Response.json({
    ok: true,
    bookings,
    stats,
  })
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const booking = db.createBooking(payload)

    return Response.json(
      {
        ok: true,
        booking,
      },
      {
        status: 201,
      }
    )
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        error: error.message ?? 'Unable to create booking.',
      },
      {
        status: error.status ?? 400,
      }
    )
  }
}

