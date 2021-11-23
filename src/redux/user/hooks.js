import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { getCurrentScope } from './selectors'
import { updateAuthorizedPages, updateCurrentScope } from '../auth'
import { resetStatsState } from '../dashboard'
import { apiClient } from 'services/networking/client'

export const useUserScope = () => {
  const currentScope = useSelector(getCurrentScope)
  const dispatch = useDispatch()

  const setCurrentScope = useCallback(
    async scope => {
      const authorizedPage = await apiClient.get(`/v3/profile/me/scope/${scope.code}`)
      dispatch(updateCurrentScope(scope))
      dispatch(updateAuthorizedPages(authorizedPage.features))
      dispatch(resetStatsState())
    },
    [dispatch]
  )
  return [currentScope, setCurrentScope]
}
