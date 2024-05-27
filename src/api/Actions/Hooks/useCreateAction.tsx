import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ActionsService, ActionsServiceKey } from '~/api/Actions/Actions.service'
import { useErrorHandler } from '~/components/shared/error/hooks'

export default function useCreateAction() {
  const client = useQueryClient()
  const { handleError } = useErrorHandler()

  return useMutation({
    mutationFn: ActionsService.create,
    onSuccess: () =>
      client.invalidateQueries({
        queryKey: [ActionsServiceKey],
      }),
    onError: handleError,
  })
}
