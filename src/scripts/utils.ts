import { FileDTO } from '@/api'
import { useEffect, useState } from 'react'

export function debounce(fn: Function, delay: number = 1000) {
  let timeout: null | ReturnType<typeof setTimeout> = null

  const debounced = (...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

export function joinPaths(...segments: (string | undefined | null)[]) {
  return segments
    .map(s => (s || '').replace(/^\/|\/$/g, '')) // remove leading/trailing slashes
    .filter(Boolean) // remove empty segments
    .join('/')
}

export function normalizeFiles(probablyFiles: FileDTO | FileDTO[] | null): FileDTO[] {
  if (probablyFiles === null) return []
  if (!Array.isArray(probablyFiles)) return [probablyFiles]
  return probablyFiles
}

export const useDebounce = <T, >(value: T, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  return debouncedValue
}