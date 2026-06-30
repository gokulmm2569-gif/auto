'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

interface Props {
  onVerified: () => void
}

export default function OtpSection({ onVerified }: Props) {
  const [phone, setPhone] = useState('+91')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)
  
  
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)

  const startTimer = useCallback((sec: number) => {
    setTimer(sec)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])


  useEffect(() => {
    if (!recaptchaRef.current) {
      try {
        recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            console.log('recaptcha solved');
          }
        });
      } catch (err) {
        console.error("Recaptcha error:", err);
      }
    }
  }, []);

  
  async function sendOtp() {
    setError('')
    if (!recaptchaRef.current) {
      setError('reCAPTCHA not initialized properly.')
      return
    }

    try {
 
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaRef.current)
      setConfirmationResult(confirmation)
      
      setOtpSent(true)
      setOtp(['', '', '', '', '', ''])
      setVerified(false)
      startTimer(60)

      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Error sending SMS. Check phone format.')
      console.error(err)
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return

    const next = [...otp]
    next[index] = value
    setOtp(next)
    setError('')

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

 
    if (index === 5 && value) {
      autoVerify(next.join(''))
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  
  async function autoVerify(code: string) {
    if (!confirmationResult) {
      setError('No OTP session found. Try sending again.')
      return
    }

    try {
      const result = await confirmationResult.confirm(code)
      if (result.user) {
        setVerified(true)
        setError('')
        onVerified()
      }
    } catch (err) {
      setError('Incorrect OTP or expired. Try again.')
    }
  }

  function verifyManual() {
    autoVerify(otp.join(''))
  }

  const canSend = phone.replace(/\D/g, '').length >= 12 

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: '#0d1b2a',
        border: '0.5px solid #1e3a5f'
      }}
    >
      
      <div id="recaptcha-container"></div>

      <p className="text-xs font-semibold mb-2 text-[#4ECDC4]">
        👤 Customer info
      </p>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <input className="px-2 py-2 rounded text-black" placeholder="Full name" />
        <input className="px-2 py-2 rounded text-black" placeholder="Email" type="email" />
      </div>

      <div className="flex gap-2 items-end">
        <input
          className="flex-1 px-2 py-2 rounded text-black"
          type="tel"
          placeholder="+919876543210"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          maxLength={13}
        />

        <button
          onClick={sendOtp}
          disabled={!canSend}
          className="px-3 py-2 rounded-lg text-xs font-bold text-black"
          style={{
            background: canSend ? '#4ECDC4' : '#1e3a5f'
          }}
        >
          📱 OTP
        </button>
      </div>

      {otpSent && (
        <div className="mt-2">
          <div className="flex gap-2 items-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el
                }}
                className="w-8 h-8 text-center rounded border text-black"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={verified}
              />
            ))}

            {!verified ? (
              <button
                onClick={verifyManual}
                className="px-2 py-1 rounded text-xs bg-orange-500 text-white"
              >
                Verify
              </button>
            ) : (
              <span className="text-xs text-green-400">
                ✓ Verified
              </span>
            )}
          </div>

          {error && (
            <p className="text-xs mt-1 text-red-400">
              {error}
            </p>
          )}

          <div className="mt-1 text-xs text-orange-400">
            {timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              <button onClick={sendOtp} className="text-[#4ECDC4]">
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}