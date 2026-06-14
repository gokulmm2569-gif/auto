import { randomUUID } from 'crypto'

const createTimestamp = () => new Date().toISOString()

const adminAccount = {
  id: randomUUID(),
  name: 'Admin',
  email: process.env.ADMIN_EMAIL ?? 'gokul@gmail.com',
  password: process.env.ADMIN_PASSWORD ?? 'gokul1233',
  role: 'admin',
  createdAt: createTimestamp(),
}

const seedUsers = [
  {
    id: randomUUID(),
    name: 'Ava Patel',
    email: 'ava@example.com',
    password: 'demo1234',
    role: 'customer',
    createdAt: createTimestamp(),
  },
  {
    id: randomUUID(),
    name: 'Noah Bennett',
    email: 'noah@example.com',
    password: 'demo1234',
    role: 'customer',
    createdAt: createTimestamp(),
  },
]

const seedBookings = [
  {
    id: randomUUID(),
    userId: seedUsers[0].id,
    guestName: seedUsers[0].name,
    guestEmail: seedUsers[0].email,
    mobileNumber: '9876543210',
    pickupLocation: 'City Center Hotel',
    dropoffLocation: 'Airport Terminal 2',
    rideType: 'Airport transfer',
    travelDate: '2026-06-09T10:30:00.000Z',
    paymentMethod: 'ONLINE',
    paymentAmount: 1200,
    estimatedDistanceKm: 54.2,
    notes: 'Customer requested a quiet sedan with luggage space.',
    status: 'CONFIRMED',
    createdAt: createTimestamp(),
  },
  {
    id: randomUUID(),
    userId: seedUsers[1].id,
    guestName: seedUsers[1].name,
    guestEmail: seedUsers[1].email,
    mobileNumber: '9123456780',
    pickupLocation: 'Railway Station',
    dropoffLocation: 'Business Park',
    rideType: 'Daily commute',
    travelDate: '2026-06-10T13:00:00.000Z',
    paymentMethod: 'OFFLINE',
    paymentAmount: 850,
    estimatedDistanceKm: 18.7,
    notes: 'Morning ride for the office team.',
    status: 'PENDING',
    createdAt: createTimestamp(),
  },
]

let users = [...seedUsers]
let bookings = [...seedBookings]

const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase()

const safeUser = (user) => {
  if (!user) {
    return null
  }

  const rest = { ...user }
  delete rest.password
  return rest
}

const createError = (message, status = 400) => {
  const error = new Error(message)
  error.status = status
  return error
}

export const db = {
  listUsers() {
    return [...users, adminAccount].map(safeUser)
  },

  findUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email)

    if (normalizedEmail === adminAccount.email) {
      return adminAccount
    }

    return users.find((user) => user.email === normalizedEmail) ?? null
  },

  createUser({ name, email, password }) {
    const normalizedEmail = normalizeEmail(email)

    if (!name || !normalizedEmail || !password) {
      throw createError('Name, email, and password are required.')
    }

    if (normalizedEmail === adminAccount.email || users.some((user) => user.email === normalizedEmail)) {
      throw createError('A user with that email already exists.', 409)
    }

    const user = {
      id: randomUUID(),
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
      role: 'customer',
      createdAt: createTimestamp(),
    }

    users = [user, ...users]
    return safeUser(user)
  },

  authenticateUser({ email, password }) {
    const normalizedEmail = normalizeEmail(email)

    if (normalizedEmail === adminAccount.email && String(password) === adminAccount.password) {
      return safeUser(adminAccount)
    }

    const user = users.find((entry) => entry.email === normalizedEmail)

    if (!user || user.password !== String(password)) {
      throw createError('Invalid email or password.', 401)
    }

    return safeUser(user)
  },

  listBookings(email) {
    const normalizedEmail = normalizeEmail(email)

    if (!normalizedEmail || normalizedEmail === adminAccount.email) {
      return [...bookings]
    }

    return bookings.filter((booking) => {
      const linkedUser = booking.userId ? users.find((user) => user.id === booking.userId) : null
      return (
        normalizeEmail(booking.guestEmail) === normalizedEmail ||
        normalizeEmail(linkedUser?.email) === normalizedEmail
      )
    })
  },

  createBooking({
    guestName,
    guestEmail,
    mobileNumber,
    pickupLocation,
    dropoffLocation,
    rideType = 'Standard ride',
    travelDate,
    paymentMethod = 'OFFLINE',
    paymentAmount = 0,
    estimatedDistanceKm = 0,
    notes,
    status = 'PENDING',
  }) {
    const normalizedEmail = normalizeEmail(guestEmail)

    if (
      !guestName ||
      !normalizedEmail ||
      !mobileNumber ||
      !pickupLocation ||
      !dropoffLocation ||
      !travelDate
    ) {
      throw createError('Guest name, email, mobile number, pickup, dropoff, and travel date are required.')
    }

    const booking = {
      id: randomUUID(),
      userId: null,
      guestName: String(guestName).trim(),
      guestEmail: normalizedEmail,
      mobileNumber: String(mobileNumber).trim(),
      pickupLocation: String(pickupLocation).trim(),
      dropoffLocation: String(dropoffLocation).trim(),
      rideType: String(rideType || 'Standard ride').trim(),
      travelDate: new Date(travelDate).toISOString(),
      paymentMethod: String(paymentMethod).toUpperCase() === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
      paymentAmount: Number(paymentAmount) || 0,
      estimatedDistanceKm: Number(estimatedDistanceKm) || 0,
      notes: notes ? String(notes).trim() : '',
      status: String(status).toUpperCase(),
      createdAt: createTimestamp(),
    }

    bookings = [booking, ...bookings]
    return booking
  },

  getDashboardStats(email) {
    const items = this.listBookings(email)
    const confirmed = items.filter((booking) => booking.status === 'CONFIRMED').length
    const pending = items.filter((booking) => booking.status === 'PENDING').length
    const onlineItems = items.filter((booking) => booking.paymentMethod === 'ONLINE')
    const offlineItems = items.filter((booking) => booking.paymentMethod !== 'ONLINE')
    const onlinePaymentTotalCash = onlineItems.reduce(
      (total, booking) => total + Number(booking.paymentAmount || 0),
      0
    )
    const offlinePaymentTotalCash = offlineItems.reduce(
      (total, booking) => total + Number(booking.paymentAmount || 0),
      0
    )

    return {
      total: items.length,
      confirmed,
      pending,
      onlinePaymentTotalCash,
      offlinePaymentTotalCash,
      onlinePaymentMembersTotal: onlineItems.length,
      offlineMembersTotal: offlineItems.length,
    }
  },
}

export { safeUser }
