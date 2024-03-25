import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { ProcurationService, ProcurationServiceKey } from '~/api/Procuration/procuration.service'
import { ProcurationModelWithPersonalInfos } from '~/api/Procuration/procuration.model'
import { HOT_DATA_CACHE_DURATION } from '~/components/Dashboard/shared/cache'

export default function useProcurationRequest({
  id,
}: {
  id?: string
}): UseQueryResult<ProcurationModelWithPersonalInfos> {
  return useQuery({
    queryFn: () => ProcurationService.getRequest({ id: id! }),
    queryKey: [ProcurationServiceKey.singleRequest, id],
    staleTime: HOT_DATA_CACHE_DURATION,
    enabled: !!id,
  })
}
