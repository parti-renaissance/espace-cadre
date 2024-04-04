import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ProcurationService, ProcurationServiceKey } from '~/api/Procuration/procuration.service'
import { ProcurationDetailsModel } from '~/api/Procuration/procuration.model'
import { HOT_DATA_CACHE_DURATION } from '~/components/Dashboard/shared/cache'

export default function useProcurationRequest({ uuid }: { uuid?: string }): UseQueryResult<ProcurationDetailsModel> {
  return useQuery({
    queryFn: () => ProcurationService.getRequest({ uuid: uuid! }),
    queryKey: [ProcurationServiceKey.singleRequest, uuid],
    staleTime: HOT_DATA_CACHE_DURATION,
    enabled: !!uuid,
  })
}
