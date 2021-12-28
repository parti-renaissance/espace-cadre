import { useMemo } from 'react'

const debounce = (callback, wait) => {
  let timeoutId = null
  return (...args) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args)
    }, wait)
  }
}

export const useDebounce = (debounceTime = 500) => {
  const debounceFunc = useMemo(
    () =>
      debounce(callback => {
        callback && callback()
      }, debounceTime),
    [debounceTime]
  )

  return debounceFunc
}
