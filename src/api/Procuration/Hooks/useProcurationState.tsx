import { useErrorHandler } from '~/components/shared/error/hooks'
import { ProcurationService, ProcurationServiceKey } from '../procuration.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBreadcrumb } from '@sentry/react'

export default function useProcurationState() {
  const { handleError } = useErrorHandler()
  const client = useQueryClient()

  return useMutation({
    mutationFn: ProcurationService.update,
    onSuccess: (_, variables) =>
      Promise.allSettled([
        client.invalidateQueries({
          queryKey: [ProcurationServiceKey.singleRequest, variables.uuid],
        }),
        client.invalidateQueries({
          queryKey: [ProcurationServiceKey.request],
        }),
      ]),
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
