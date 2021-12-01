import { useCallback, useState } from 'react'
import { useCustomSnackbar } from '../notification/hooks'
import { getFormattedErrorMessages, handleGenericHttpErrors } from './helpers'

export const useErrorHandler = () => {
  const [errorMessages, setErrorMessages] = useState([])
  const { enqueueSnackbar } = useCustomSnackbar()

  const resetErrorMessages = useCallback(() => {
    setErrorMessages([])
  }, [])

  const handleError = useCallback(
    error => {
      const { response = {}, stack, message } = error
      const { status, data } = response
      handleGenericHttpErrors(enqueueSnackbar, status, stack, message)
      setErrorMessages(getFormattedErrorMessages(data))
      return () => resetErrorMessages()
    },
    [enqueueSnackbar, resetErrorMessages]
  )

  return { handleError, errorMessages, resetErrorMessages }
}
