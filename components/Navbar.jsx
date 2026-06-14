'use client'

import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/book', label: 'Book Ride' },
  { href: '/login', label: 'Login' },
]

export default function Navbar() {

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">

      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.2em] text-white uppercase"
        >
          Auto Ride Travel
        </Link>


        <div className="flex items-center gap-3 text-sm text-zinc-200">


          {links.map((link)=>(
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}



          <Link
            href="/register"
            className="rounded-full bg-yellow-400 px-4 py-2 font-medium text-black transition hover:bg-yellow-300"
          >
            Get Started
          </Link>


        </div>

      </nav>

    </header>
  )
}