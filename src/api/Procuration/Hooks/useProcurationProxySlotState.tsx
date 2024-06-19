import { useErrorHandler } from '~/components/shared/error/hooks'
import { ProcurationService, ProcurationServiceKey } from '../procuration.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBreadcrumb } from '@sentry/react'

export default function useProcurationProxySlotState() {
  const { handleError } = useErrorHandler()
  const client = useQueryClient()

  return useMutation({
    mutationFn: ProcurationService.updateProxySlot,
    onSettled: () =>
      client.invalidateQueries({
        queryKey: [ProcurationServiceKey.availableProxies],
      }),
    onError: (error: Error) => {
      addBreadcrumb({ message: 'Error while matching procuration' })
      handleError(error)
    },
  })
}
