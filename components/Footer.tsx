'use client'

import Link from 'next/link'

const footerLinks = {
  'Services': [
    { label: 'Book a ride', href: '/' },
    { label: 'Shared rides', href: '/shared' },
    { label: 'Airport transfers', href: '/airport' },
    { label: 'Outstation trips', href: '/outstation' },
    { label: 'Corporate booking', href: '/corporate' },
  ],
  'Company': [
    { label: 'About us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  'Support': [
    { label: 'Help center', href: '/help' },
    { label: 'Safety', href: '/safety' },
    { label: 'Contact us', href: '/contact' },
    { label: 'Report an issue', href: '/report' },
  ],
  'Legal': [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms of service', href: '/terms' },
    { label: 'Cookie policy', href: '/cookies' },
    { label: 'Refund policy', href: '/refunds' },
  ],
}

const socialLinks = [
  { label: 'Twitter / X', href: 'https://twitter.com', icon: '𝕏' },
  { label: 'Instagram', href: 'https://instagram.com', icon: '◈' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'f' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'in' },
]

const stats = [
  { value: '2.4M+', label: 'Rides completed' },
  { value: '18 cities', label: 'Across India' },
  { value: '4.8 ★', label: 'Driver rating' },
  { value: '3 min', label: 'Avg pickup time' },
]

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ background: 'var(--card)', fontFamily: 'var(--font-geist-sans)' }}>
      {/* App download banner */}
      <div style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #00C9A7 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xl font-bold text-slate-900">Get the Auto Ride app</p>
            <p className="text-sm mt-2 text-slate-800">
              Book rides faster, track in real-time, pay seamlessly
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-transform hover:scale-105"
              style={{ background: '#FFF', color: '#D4AF37' }}
            >
              🍎 App Store
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-transform hover:scale-105"
              style={{ background: '#00C9A7', color: '#111827' }}
            >
              🤖 Google Play
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
                {s.value}
              </div>
              <div className="text-xs mt-2 uppercase tracking-widest" style={{ color: '#94A3B8' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                style={{ background: '#D4AF37', color: '#111827' }}
              >
                🚗
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-bold" style={{ color: '#D4AF37' }}>
                  Auto Ride
                </span>
                <span className="text-xs uppercase tracking-widest" style={{ color: '#475569' }}>
                  Travel
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#94A3B8' }}>
              Safe, reliable, and affordable rides across the city.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all duration-300"
                  style={{ 
                    border: '1.5px solid rgba(212, 175, 55, 0.3)',
                    color: '#94A3B8'
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#D4AF37'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = '#D4AF37'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(212, 175, 55, 0.1)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(212, 175, 55, 0.3)'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8'
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-5"
                style={{ color: '#D4AF37' }}
              >
                {heading}
              </p>
              <ul className="flex flex-col gap-3.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:opacity-100"
                      style={{ color: '#94A3B8' }}
                      onMouseEnter={e => {
                        ;(e.currentTarget as HTMLAnchorElement).style.color = '#00C9A7'
                      }}
                      onMouseLeave={e => {
                        ;(e.currentTarget as HTMLAnchorElement).style.color = '#94A3B8'
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: '#475569' }}>
            © {new Date().getFullYear()} Auto Ride Travel. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <span className="text-xs flex items-center gap-2" style={{ color: '#475569' }}>
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: '#00C9A7' }}
              />
              All systems operational
            </span>
            <span style={{ color: '#475569' }}>•</span>
            <span className="text-xs" style={{ color: '#475569' }}>🇮🇳 India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
