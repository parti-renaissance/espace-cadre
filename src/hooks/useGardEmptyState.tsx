import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Return to previous page if location state is null.
 * @param onEmpty
 */
export default function useGardEmptyState(onEmpty?: () => void) {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (state === null) {
    onEmpty ? onEmpty() : navigate(-1)
    return
  }
}
