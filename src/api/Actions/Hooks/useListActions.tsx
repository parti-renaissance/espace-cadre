import { useErrorHandler } from '~/components/shared/error/hooks'
import usePaginatedQuery from '~/hooks/usePaginatedQuery'
import { ActionsService, ActionsServiceKey } from '~/api/Actions/Actions.service'

export default function useListActions({ params }: { params?: Record<string, unknown> }) {
  const { handleError } = useErrorHandler()

  return usePaginatedQuery({
    queryKey: [ActionsServiceKey],
    queryFn: ({ signal, pageParam = 1 }) => ActionsService.list({ params: { ...params, page: pageParam }, signal }),
    keepPreviousData: true,
    onError: handleError,
  })
}
