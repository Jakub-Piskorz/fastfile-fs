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