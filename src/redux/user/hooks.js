import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { getCurrentScope } from './selectors'
import { updateAuthorizedPages, updateCurrentScope } from '../auth'
import { apiClient } from 'services/networking/client'

export const useUserScope = () => {
  const currentScope = useSelector(getCurrentScope)
  const dispatch = useDispatch()

  const setCurrentScope = useCallback(
    async scope => {
      const authorizedPage = await apiClient.get(`/v3/profile/me/scope/${scope.code}`)
      dispatch(updateCurrentScope(authorizedPage))
      dispatch(updateAuthorizedPages(authorizedPage.features))
    },
    [dispatch]
  )
  return [currentScope, setCurrentScope]
}
