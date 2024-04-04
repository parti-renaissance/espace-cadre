import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ProcurationService, ProcurationServiceKey } from '~/api/Procuration/procuration.service'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { addBreadcrumb } from '@sentry/core'

export default function useProcurationUnmatch() {
  const { handleError } = useErrorHandler()
  const client = useQueryClient()

  return useMutation({
    mutationFn: ProcurationService.unmatch,
    onSuccess: (_, variables) =>
      Promise.allSettled([
        client.invalidateQueries({
          queryKey: [ProcurationServiceKey.singleRequest, variables.uuid],
        }),
        client.invalidateQueries({
          queryKey: [ProcurationServiceKey.request],
        }),
      ]),
    onSettled: (_, error, variables) =>
      client.invalidateQueries({
        queryKey: [ProcurationServiceKey.availableProxies, variables.uuid],
      }),
    onError: (error: Error) => {
      addBreadcrumb({ message: 'Error while matching procuration' })
      handleError(error)
    },
  })
}
