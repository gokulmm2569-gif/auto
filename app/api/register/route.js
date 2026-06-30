import { NextRequest, NextResponse } from 'next/server'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // 🔥 Firebase Auth-ல் user create (Backend-ல்)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    const user = userCredential.user

    // 🔥 Firestore-ல் user டேட்டா ஸ்டோர்
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email: user.email,
      createdAt: new Date(),
    })

    return NextResponse.json({
      user: {
        uid: user.uid,
        email: user.email,
        name,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    )
  }
}