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
