import { messageSynchronizationStatus } from '~/api/messagerie'
import { useEffect, useRef, useState } from 'react'

interface UseWaitForMessageSyncProps {
  uuid: string
  interval?: number // ms,
  onTooManyRetries?: () => void
  onError?: (error: Error) => void
}

export default function useWaitForMessageSync({ uuid, interval = 4000, ...props }: UseWaitForMessageSyncProps) {
  const [isSync, setIsSync] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const timeoutRef = useRef<null | number>(null)
  const retryNumber = useRef(0)

  const handleRetry = useRef(() => {
    if (retryNumber.current > 10) {
      setIsSyncing(false)
      return
    }

    setIsSyncing(true)
    retryNumber.current += 1
    return messageSynchronizationStatus(uuid)
      .then(({ isSynchronized }) => {
        if (isSynchronized) {
          setIsSync(isSynchronized)
          setIsSyncing(false)
          return
        }

        timeoutRef.current = window.setTimeout(() => {
          handleRetry.current()
        }, interval)
      })
      .catch(error => {
        if (props.onError) {
          props.onError(error)
          setIsSyncing(false)
          setIsSync(false)
        }
      })
  })

  useEffect(() => {
    handleRetry.current()
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        retryNumber.current = 0
      }
    }
  }, [])

  return {
    isSync,
    isSyncing,
  }
}
