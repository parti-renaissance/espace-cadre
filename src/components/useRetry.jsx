import { useRef, useState, useCallback } from 'react'

/**
 * useRetry will launch the f function, and look at the response.
 * If the response contains isSynchronized = false,
 * it will relaunch f a few milliseconds later (specified by the duration param).
 * If the reponse contains isSynchronized = true, it will run the option 'run' method
 * provided in the params /!\ run must be a function in a React.useCallBack() /!\.
 * The f function will be relaunch every 'duration' milliseconds until synchronized is true or
 * maxAttempts is reached.
 * If max attempts is reached, onError will be called /!\ onError must be a function in a React.useCallBack() /!\
 * */
const useRetry = (f, duration, maxAttempts, onSuccess, onError) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const interval = useRef(null)
  const iteration = useRef(0)

  const clear = () => {
    clearInterval(interval.current)
    setLoading(false)
  }

  const launch = useCallback(
    (...args) => {
      clear()
      setLoading(true)
      setData(null)
      iteration.current = 0
      interval.current = setInterval(async () => {
        const result = await f(...args)
        if (result?.isSynchronized) {
          clear()
          setData(result)
          onSuccess?.call()
        }
        iteration.current += 1
        if (iteration.current >= maxAttempts) {
          clear()
          onError?.call()
        }
      }, duration)
    },
    [duration, f, maxAttempts, onError, onSuccess]
  )

  return [loading, data, launch, clear]
}
export default useRetry
