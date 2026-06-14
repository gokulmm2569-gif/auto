'use client'
import { useState, useRef, useCallback } from 'react'

export interface LocationResult {
  label: string
  lat: number
  lon: number
}

export function useLocationSearch() {
  const [suggestions, setSuggestions] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const search = useCallback((q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (q.length < 3) { setSuggestions([]); return }
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/geocode?action=suggest&q=${encodeURIComponent(q)}`)
        const data: LocationResult[] = await res.json()
        setSuggestions(data)
      } catch { setSuggestions([]) }
      setLoading(false)
    }, 350)
  }, [])

  const clear = useCallback(() => setSuggestions([]), [])

  return { suggestions, loading, search, clear }
}
