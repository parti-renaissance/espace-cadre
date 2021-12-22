import { useCallback, useState } from 'react'
import { useCustomSnackbar } from '../notification/hooks'
import { getFormattedErrorMessages, handleGenericHttpErrors } from './helpers'
import * as Sentry from '@sentry/react'

export const useErrorHandler = () => {
  const [errorMessages, setErrorMessages] = useState([])
  const [errorRawMessage, setErrorRawMessage] = useState(null)
  const { enqueueSnackbar } = useCustomSnackbar()

  const resetErrorMessages = useCallback(() => {
    setErrorMessages([])
    setErrorRawMessage(null)
  }, [])

  const snackBarWithOptions = useCallback(
    (status, stack, message) => enqueueSnackbar(status, stack, message, { autoHideDuration: 10000 }),
    [enqueueSnackbar]
  )

  const handleError = useCallback(
    error => {
      const { response = {}, stack, message } = error
      const { status, data } = response
      handleGenericHttpErrors(snackBarWithOptions, status, stack, message)
      setErrorMessages(getFormattedErrorMessages(data))
      setErrorRawMessage(message)
      Sentry.captureException(error)
      return () => resetErrorMessages()
    },
    [snackBarWithOptions, resetErrorMessages]
  )

  return { handleError, errorMessages, errorRawMessage, resetErrorMessages }
}
