'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Props {
  onVerified: () => void
}

export default function OtpSection({ onVerified }: Props) {

  const [phone,setPhone] = useState('')
  const [otpSent,setOtpSent] = useState(false)
  const [otp,setOtp] = useState(['','','',''])
  const [realOtp,setRealOtp] = useState('')
  const [verified,setVerified] = useState(false)
  const [error,setError] = useState('')
  const [timer,setTimer] = useState(0)
  const [demoOtp,setDemoOtp] = useState('')

  const inputRefs = useRef<(HTMLInputElement|null)[]>([])
  const timerRef = useRef<NodeJS.Timeout|null>(null)


  const startTimer = useCallback((sec:number)=>{

    setTimer(sec)

    if(timerRef.current)
      clearInterval(timerRef.current)

    timerRef.current=setInterval(()=>{

      setTimer(prev=>{

        if(prev<=1){
          clearInterval(timerRef.current!)
          return 0
        }

        return prev-1

      })

    },1000)

  },[])



  useEffect(()=>{

    return ()=>{

      if(timerRef.current)
        clearInterval(timerRef.current)

    }

  },[])



  function sendOtp(){

    const code=String(
      Math.floor(1000+Math.random()*9000)
    )

    setRealOtp(code)
    setDemoOtp(code)
    setOtpSent(true)
    setOtp(['','','',''])
    setError('')
    setVerified(false)
    startTimer(60)

    setTimeout(()=>{
      inputRefs.current[0]?.focus()
    },100)

  }



  function handleOtpChange(index:number,value:string){

    if(!/^\d?$/.test(value))
      return

    const next=[...otp]
    next[index]=value

    setOtp(next)
    setError('')


    if(value && index<3)
      inputRefs.current[index+1]?.focus()


    if(index===3 && value)
      autoVerify(next.join(''))

  }



  function handleKeyDown(index:number,e:React.KeyboardEvent){

    if(
      e.key==='Backspace' &&
      !otp[index] &&
      index>0
    ){

      inputRefs.current[index-1]?.focus()

    }

  }



  function autoVerify(code:string){

    if(code===realOtp){

      setVerified(true)
      setError('')
      onVerified()

    }else{

      setError('Incorrect OTP. Try again.')

    }

  }
  function verifyManual(){

  autoVerify(otp.join(''))

}



  const canSend =
    phone.replace(/\D/g,'').length>=10



  return (

    <div
      className="rounded-xl p-3"
      style={{
        background:'#0d1b2a',
        border:'0.5px solid #1e3a5f'
      }}
    >

      <p
        className="text-xs font-semibold mb-2 text-[#4ECDC4]"
      >
        👤 Customer info
      </p>


      <div className="grid grid-cols-2 gap-2 mb-2">

        <input
          className="px-2 py-2 rounded"
          placeholder="Full name"
        />

        <input
          className="px-2 py-2 rounded"
          placeholder="Email"
          type="email"
        />

      </div>



      <div className="flex gap-2 items-end">

        <input
          className="flex-1 px-2 py-2 rounded"
          type="tel"
          placeholder="+91 9876543210"
          value={phone}
          onChange={e=>setPhone(e.target.value)}
          maxLength={13}
        />


        <button
          onClick={sendOtp}
          disabled={!canSend}
          className="px-3 py-2 rounded-lg text-xs font-bold"
          style={{
            background:canSend?'#4ECDC4':'#1e3a5f'
          }}
        >
          📱 OTP
        </button>


      </div>



      {otpSent && (

        <div className="mt-2">


          <div
            className="text-xs px-2 py-1 rounded mb-1"
            style={{
              background:'#082020',
              color:'#34d399'
            }}
          >
            OTP:
            <b>{demoOtp}</b>
          </div>


          <div className="flex gap-2 items-center">


            {otp.map((digit,i)=>(

              <input
                key={i}
                ref={el=>inputRefs.current[i]=el}
                className="w-8 h-8 text-center rounded border"
                maxLength={1}
                value={digit}
                onChange={
                  e=>handleOtpChange(i,e.target.value)
                }
                onKeyDown={
                  e=>handleKeyDown(i,e)
                }
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

            ):(

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

            {timer>0
              ? `Resend in ${timer}s`
              : 
              <button className="text-[#4ECDC4]">
                Resend OTP
              </button>
            }

          </div>


        </div>

      )}

    </div>

  )

}