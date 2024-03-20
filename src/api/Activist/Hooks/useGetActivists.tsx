import { useQuery } from '@tanstack/react-query'
import { ActivistService, ActivistServiceKey } from '~/api/Activist/Activist.service'
import { useErrorHandler } from '~/components/shared/error/hooks'

export default function useGetActivists(filters: Record<string, unknown>) {
  const { handleError } = useErrorHandler()

  return useQuery({
    queryKey: [ActivistServiceKey, filters],
    queryFn: ({ signal }) => ActivistService.get({ filters, signal }),
    keepPreviousData: true,
    onError: handleError,
  })
}
