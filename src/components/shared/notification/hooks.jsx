import { useCallback } from 'react'
import { useSnackbar } from 'notistack'
import { v1 as uuid } from 'uuid'
import { notifyVariants } from './constants'
import UISnackBar from '~/ui/SnackBar/SnackBar'

export const useCustomSnackbar = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const customEnqueue = useCallback(
    (message, variant = notifyVariants.success, detail = null, options = {}) => {
      const key = uuid()
      const content = (key, message) => (
        <UISnackBar id={key} message={message} variant={variant} expend>
          {detail}
        </UISnackBar>
      )
      return enqueueSnackbar(message, { variant, key, content, ...options })
    },
    [enqueueSnackbar]
  )

  return { enqueueSnackbar: customEnqueue, closeSnackbar }
}
