import { useCallback, useState } from 'react'
import { useCustomSnackbar } from '../notification/hooks'
import { getFormattedErrorMessages, handleGenericHttpErrors } from './helpers'
import * as Sentry from '@sentry/react'

const hasErrorDetail = x => typeof x === 'object' && x !== null && 'detail' in x
const hasErrorMessage = x => typeof x === 'object' && x !== null && 'message' in x

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
      const { response, stack, message } = error
      const { status, data } = response
      let mess = message
      if (hasErrorMessage(data)) {
        mess = data.message
      }

      if (hasErrorDetail(data)) {
        mess = data.detail
      }

      handleGenericHttpErrors(snackBarWithOptions, status, stack, mess)
      const formattedErrorMessages = getFormattedErrorMessages(data)
      setErrorMessages(formattedErrorMessages)
      setErrorRawMessage(mess)
      Sentry.addBreadcrumb({
        category: 'request',
        message: Object.keys(data).length ? JSON.stringify(data) : message,
        level: 'debug',
      })
      Sentry.captureException(error)
      return resetErrorMessages
    },
    [snackBarWithOptions, resetErrorMessages]
  )

  return { handleError, errorMessages, errorRawMessage, resetErrorMessages }
}
