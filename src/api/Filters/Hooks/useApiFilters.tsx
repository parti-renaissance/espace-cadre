import { useQuery } from '@tanstack/react-query'
import { FilterService, FilterServiceKey } from '~/api/Filters/Filter.service'
import { FeatureEnum } from '~/models/feature.enum'
import { COLD_DATA_CACHE_DURATION } from '~/components/Dashboard/shared/cache'

export default function useApiFilters({
  feature,
  extractFavorites = false,
}: {
  feature: FeatureEnum
  extractFavorites: boolean
}) {
  return useQuery({
    queryFn: () => FilterService.get(feature, extractFavorites),
    queryKey: [FilterServiceKey, feature],
    staleTime: COLD_DATA_CACHE_DURATION,
  })
}
