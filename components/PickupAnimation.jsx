export default function PickupAnimation() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.16),_transparent_34%),linear-gradient(180deg,_rgba(17,17,17,0.98),_rgba(5,5,5,0.98))] p-5 shadow-2xl">
        <div className="absolute inset-x-0 top-12 h-px bg-white/10" />
        <div className="absolute inset-x-0 bottom-24 h-px bg-white/10" />
        <div className="absolute inset-x-8 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.7)_20%,rgba(250,204,21,0.9)_50%,rgba(250,204,21,0.7)_80%,transparent)] opacity-80" />
        <div className="absolute inset-x-8 top-[58%] h-[2px] rounded-full bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.32)_0_18px,transparent_18px_34px)] opacity-50" />

        <div className="pickup-beacon absolute left-8 top-8 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-yellow-200">
          Pickup
        </div>
        <div className="absolute right-8 top-10 text-right">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Dropoff</p>
          <p className="mt-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-200">
            Ride in motion
          </p>
        </div>

        <div className="pickup-drive absolute bottom-14 left-4 w-[15rem]">
          <div className="relative">
            <div className="absolute -bottom-2 left-6 right-6 h-4 rounded-full bg-black/60 blur-xl" />
            <div className="relative h-24 rounded-[2rem] border border-yellow-200/20 bg-[linear-gradient(180deg,_#facc15_0%,_#eab308_100%)] shadow-[0_18px_45px_rgba(250,204,21,0.25)]">
              <div className="absolute left-5 top-4 h-8 w-14 rounded-2xl bg-black/85" />
              <div className="absolute left-20 top-4 h-8 w-10 rounded-2xl border border-black/30 bg-black/85" />
              <div className="absolute right-4 top-5 h-2 w-6 rounded-full bg-white/90" />
              <div className="absolute right-4 top-9 h-2 w-6 rounded-full bg-white/60" />
              <div className="absolute -top-4 left-10 h-6 w-12 rounded-t-2xl rounded-b-lg border border-yellow-200/20 bg-[linear-gradient(180deg,_#fef08a,_#f59e0b)]" />
              <div className="absolute -top-7 left-16 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] text-white/80">
                <span className="inline-block h-2 w-2 rounded-full bg-yellow-300" />
                Auto
              </div>

              <div className="absolute -bottom-4 left-4 h-9 w-9 rounded-full border-4 border-black bg-zinc-900" />
              <div className="absolute -bottom-4 right-4 h-9 w-9 rounded-full border-4 border-black bg-zinc-900" />
              <div className="absolute -bottom-2 left-6 h-5 w-5 rounded-full border border-white/15 bg-white/10 animate-spin [animation-duration:0.8s]" />
              <div className="absolute -bottom-2 right-6 h-5 w-5 rounded-full border border-white/15 bg-white/10 animate-spin [animation-duration:0.8s]" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4">
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
            Auto drives in, picks up, and moves out.
          </div>
          <div className="hidden rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-yellow-100 sm:block">
            Live motion
          </div>
        </div>
      </div>
    </div>
  )
}
