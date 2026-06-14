const statusStyles = {
  PENDING: 'bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/30',
  CONFIRMED: 'bg-yellow-400/15 text-yellow-200 ring-1 ring-yellow-300/30',
  COMPLETED: 'bg-white/10 text-white ring-1 ring-white/20',
  CANCELLED: 'bg-zinc-400/15 text-zinc-200 ring-1 ring-zinc-300/30',
}

export default function BookingCard({ booking }) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(booking.travelDate))

  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-lg backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{booking.guestName}</h3>
          <p className="mt-1 text-sm text-zinc-300">{booking.guestEmail}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[booking.status] ?? statusStyles.PENDING}`}>
          {booking.status}
        </span>
      </div>
      <dl className="mt-5 grid gap-3 text-sm text-zinc-300">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Pickup</dt>
          <dd className="font-medium text-white">{booking.pickupLocation}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Dropoff</dt>
          <dd className="font-medium text-white">{booking.dropoffLocation}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Ride type</dt>
          <dd className="font-medium text-white">{booking.rideType}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Mobile</dt>
          <dd className="font-medium text-white">{booking.mobileNumber}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Travel time</dt>
          <dd className="font-medium text-white">{formattedDate}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Distance</dt>
          <dd className="font-medium text-white">
            {booking.estimatedDistanceKm ? `${booking.estimatedDistanceKm} km` : 'N/A'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-zinc-400">Payment</dt>
          <dd className="font-medium text-white">
            {booking.paymentMethod} {booking.paymentAmount ? `- ${booking.paymentAmount}` : ''}
          </dd>
        </div>
      </dl>
      {booking.notes ? <p className="mt-4 text-sm leading-6 text-zinc-300">{booking.notes}</p> : null}
    </article>
  )
}
