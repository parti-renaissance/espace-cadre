import { useMutation } from '@tanstack/react-query'
import { exportActivists } from '~/api/activist'

export default function useExportActivists(filters: Record<string, unknown>) {
  return useMutation({
    mutationFn: () => exportActivists(filters),
  })
}
