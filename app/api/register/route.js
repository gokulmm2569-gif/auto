import { db } from '../../../lib/db'

export async function POST(request) {
  try {
    const payload = await request.json()
    const user = db.createUser(payload)

    return Response.json({ ok: true, user }, { status: 201 })
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message ?? 'Unable to register user.' },
      { status: error.status ?? 400 }
    )
  }
}
