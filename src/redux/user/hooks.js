import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { getCurrentScope } from './selectors'
import { updateCurrentScope } from '../auth'
import { apiClient } from '~/services/networking/client'

export const useUserScope = () => {
  const currentScope = useSelector(getCurrentScope)
  const dispatch = useDispatch()

  const setCurrentScope = useCallback(
    async scopeCode => dispatch(updateCurrentScope(await apiClient.get(`/v3/profile/me/scope/${scopeCode}`))),
    [dispatch]
  )
  return [currentScope, setCurrentScope]
}
