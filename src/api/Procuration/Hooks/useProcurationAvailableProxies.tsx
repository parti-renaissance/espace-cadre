import { useErrorHandler } from '~/components/shared/error/hooks'
import { ProcurationService, ProcurationServiceKey } from '~/api/Procuration/procuration.service'
import usePaginatedQuery from '~/hooks/usePaginatedQuery'

export default function useProcurationAvailableProxies({
  params,
  uuid,
}: {
  uuid?: string
  params: Record<string, unknown>
}) {
  const { handleError } = useErrorHandler()

  return usePaginatedQuery({
    queryKey: [ProcurationServiceKey.availableProxies, uuid, params],
    queryFn: ({ signal, pageParam = 1 }) =>
      ProcurationService.getRequestAvailableProxies({ params: { ...params, page: pageParam }, signal, uuid: uuid! }),
    keepPreviousData: true,
    onError: handleError,
    enabled: !!uuid,
  })
}
