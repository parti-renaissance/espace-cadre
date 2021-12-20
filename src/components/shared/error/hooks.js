import { useCallback, useState } from 'react'
import { useCustomSnackbar } from '../notification/hooks'
import { getFormattedErrorMessages, handleGenericHttpErrors } from './helpers'
import * as Sentry from '@sentry/react'

export const useErrorHandler = () => {
  const [errorMessages, setErrorMessages] = useState([])
  const { enqueueSnackbar } = useCustomSnackbar()

  const resetErrorMessages = useCallback(() => {
    setErrorMessages([])
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
      Sentry.captureException(error)
      return () => resetErrorMessages()
    },
    [snackBarWithOptions, resetErrorMessages]
  )

  return { handleError, errorMessages, resetErrorMessages }
}
