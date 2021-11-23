import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSnackbar } from 'notistack'
import { v1 as uuid } from 'uuid'

import { getGlobalErrors } from '../../../redux/errors/selectors'
import { clearError } from '../../../redux/errors'
import { notifyVariants, notifyMessages } from './constants'
import UISnackBar from 'ui/SnackBar/SnackBar'

export const useCustomSnackbar = () => {
  const dispatch = useDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const clearGlobalError = useCallback(
    id => {
      dispatch(clearError({ id }))
    },
    [dispatch]
  )
  const customEnqueue = useCallback(
    (message, variant = notifyVariants.success, id = null, detail = null) => {
      const errorCase = variant === notifyVariants.error
      const onClose = (_, reason, id) => (errorCase && reason === 'timeout' ? clearGlobalError(id) : null)
      const onDismiss = errorCase ? clearGlobalError.bind(null, id) : null
      const key = id || uuid()
      const content = (key, message) => (
        <UISnackBar id={key} message={message} variant={variant} content={detail} dismissResolve={onDismiss} />
      )
      return enqueueSnackbar(message, { variant, key, content, onClose })
    },
    [enqueueSnackbar, clearGlobalError]
  )

  return { enqueueSnackbar: customEnqueue, closeSnackbar }
}

export const useGlobalNotification = () => {
  const globalErrors = useSelector(getGlobalErrors)
  const { enqueueSnackbar } = useCustomSnackbar()

  useEffect(() => {
    if (Object.keys(globalErrors).length === 0) return
    Object.entries(globalErrors).forEach(([id, { detail }]) => {
      enqueueSnackbar(notifyMessages.errorTitle, notifyVariants.error, id, detail || notifyMessages.errorDetail)
    })
  }, [globalErrors, enqueueSnackbar])
}
