import { useQuery } from '@tanstack/react-query'
import { ActivistService, ActivistServiceKey } from '~/api/Activist/Activist.service'

export default function useGetActivists(filters: Record<string, unknown>) {
  return useQuery({
    queryKey: [ActivistServiceKey, filters],
    queryFn: () => ActivistService.get(filters),
  })
}
