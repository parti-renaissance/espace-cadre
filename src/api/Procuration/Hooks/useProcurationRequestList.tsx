import { useErrorHandler } from '~/components/shared/error/hooks'
import { ProcurationService, ProcurationServiceKey } from '~/api/Procuration/procuration.service'
import usePaginatedQuery from '~/hooks/usePaginatedQuery'

export default function useProcurationRequestList(params: Record<string, unknown>) {
  const { handleError } = useErrorHandler()

  return usePaginatedQuery({
    queryKey: [ProcurationServiceKey.request, params],
    queryFn: ({ signal, pageParam = 1 }) =>
      ProcurationService.listRequests({ params: { ...params, page: pageParam }, signal }),
    keepPreviousData: true,
    onError: handleError,
  })
}
