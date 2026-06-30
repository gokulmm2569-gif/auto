export const runtime = 'nodejs'

const otpStore = new Map()
const OTP_TTL_MS = 5 * 60 * 1000

const normalizeMobile = (value) => String(value ?? '').replace(/\s+/g, '').trim()

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000))

const hasTwilioConfig =
  Boolean(process.env.TWILIO_ACCOUNT_SID) &&
  Boolean(process.env.TWILIO_AUTH_TOKEN) &&
  Boolean(process.env.TWILIO_FROM_NUMBER);

async function sendSmsViaFast2SMS({ to, body }) {
  const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      route: "q",
      message: body,
      language: "english",
      flash: 0,
      numbers: to,
    }),
  });

  if (!response.ok) {
    throw new Error("SMS sending failed");
  }

  return await response.json();
}

async function sendSmsViaTwilio({ to, body }) {
  if (!hasTwilioConfig) {
    return false
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_FROM_NUMBER
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const authorization = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authorization}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: to,
      From: fromNumber,
      Body: body,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`SMS provider error: ${errorText}`)
  }

  return true
}

export async function POST(request) {
  try {
    const payload = await request.json()
    const action = String(payload?.action ?? '').toLowerCase()
    const mobileNumber = normalizeMobile(payload?.mobileNumber)

    if (!action) {
      return Response.json({ ok: false, error: 'Action is required.' }, { status: 400 })
    }

    if (action === 'send') {
  if (!mobileNumber) {
    return Response.json(
      { ok: false, error: 'Mobile number is required.' },
      { status: 400 }
    )
  }

  const code = createOtp()

  otpStore.set(mobileNumber, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
  })

  const smsMessage = `Your Auto Ride OTP is ${code}. It expires in 5 minutes.`

  await sendSmsViaFast2SMS({
    to: mobileNumber,
    body: smsMessage,
  })

  return Response.json({
    ok: true,
    message: "OTP sent successfully.",
  })
}
    if (action === 'verify') {
      const code = String(payload?.code ?? '').trim()

      if (!mobileNumber || !code) {
        return Response.json({ ok: false, error: 'Mobile number and OTP are required.' }, { status: 400 })
      }

      const entry = otpStore.get(mobileNumber)

      if (!entry) {
        return Response.json({ ok: false, error: 'OTP not found. Please send it again.' }, { status: 404 })
      }

      if (Date.now() > entry.expiresAt) {
        otpStore.delete(mobileNumber)
        return Response.json({ ok: false, error: 'OTP expired. Please send it again.' }, { status: 410 })
      }

      if (entry.code !== code) {
        return Response.json({ ok: false, error: 'Invalid OTP.' }, { status: 401 })
      }

      otpStore.delete(mobileNumber)
      return Response.json({
        ok: true,
        message: 'Mobile number verified successfully.',
      })
    }

    return Response.json({ ok: false, error: 'Unsupported OTP action.' }, { status: 400 })
  } catch (error) {
    return Response.json(
      { ok: false, error: error.message ?? 'Unable to process OTP request.' },
      { status: 500 }
    )
  }
}
