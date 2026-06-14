import { db } from '../../../lib/db'

export async function POST(request) {
  try {
    const payload = await request.json()
    const user = db.authenticateUser(payload)

    return Response.json({ ok: true, user })
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message ?? 'Unable to log in.' },
      { status: error.status ?? 400 }
    )
  }
}
