import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { getDashboardAdherents } from './selectors'
import { updateAdherents } from './slice'

export const useDashboardAdherentCache = () => {
  const dispatch = useDispatch()

  const dashboardAdherents = useSelector(getDashboardAdherents)

  const setDashboardAdherents = useCallback(body => dispatch(updateAdherents(body)), [dispatch])

  return [dashboardAdherents, setDashboardAdherents]
}
