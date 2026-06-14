'use client'
import { useState, useRef, useEffect } from 'react'
import { useLocationSearch, LocationResult } from '@/hooks/useLocationSearch'

interface Props {
  id: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  onSelect: (loc: LocationResult) => void
  dotColor: string
  onGps?: () => void
  actionLabel?: string
  onAction?: () => void
}

export default function LocationInput({
  id, placeholder, value, onChange, onSelect, dotColor, onGps, actionLabel, onAction,
}: Props) {
  const { suggestions, search, clear } = useLocationSearch()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={wrapRef} className="relative flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ background: dotColor }}
      />
      <div className="flex-1 relative">
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={e => {
            onChange(e.target.value)
            search(e.target.value)
            setOpen(true)
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          style={{ paddingRight: '72px' }}
        />
        <button
          type="button"
          onClick={onGps || onAction}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-md"
          style={{ background: '#1e3a5f', color: '#4ECDC4', border: 'none', cursor: 'pointer' }}
        >
          {actionLabel || '📡 GPS'}
        </button>

        {open && suggestions.length > 0 && (
          <div
            className="absolute left-0 right-0 z-20 mt-1 rounded-lg overflow-hidden"
            style={{ background: '#0a1929', border: '1px solid #4ECDC4', maxHeight: '180px', overflowY: 'auto' }}
          >
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="px-3 py-2 text-sm cursor-pointer"
                style={{ color: '#cdd9e5', borderBottom: '0.5px solid #1e3a5f' }}
                onMouseDown={() => {
                  onSelect(s)
                  onChange(s.label)
                  setOpen(false)
                  clear()
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#4ECDC4')}
                onMouseLeave={e => (e.currentTarget.style.color = '#cdd9e5')}
              >
                {s.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
