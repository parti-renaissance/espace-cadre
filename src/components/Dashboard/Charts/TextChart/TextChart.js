import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import Loader from 'ui/Loader'
import { apiClientProxy } from '../../../../services/networking/client'
import { useDashboardAdherentCache } from '../../../../redux/dashboard/hooks'
import { useUserScope } from '../../../../redux/user/hooks'
import ErrorComponent from '../../../ErrorComponent/ErrorComponent'
import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  dashboardTitle: {
    color: theme.palette.blackCorner,
    fontSize: '16px',
    fontWeight: '600',
  },
}))

function TextChart() {
  const classes = useStyles()
  const [dashboardAdherents, setDashboardAdherents] = useDashboardAdherentCache()
  const [currentScope] = useUserScope()
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    const getDashboardAdherents = async () => {
      try {
        if (dashboardAdherents === null && currentScope) {
          setDashboardAdherents(await apiClientProxy.get('/adherents'))
        }
      } catch (error) {
        setErrorMessage(error)
      }
    }
    getDashboardAdherents()
  }, [currentScope, dashboardAdherents, setDashboardAdherents])

  const dashboardAdherentsContent = () => {
    if (dashboardAdherents !== null) {
      return (
        <Box mb={2}>
          <Box className={classes.dashboardTitle}>
            {currentScope.name} &gt;
            {currentScope.zones && currentScope.zones.map((el, index) => `${index ? ', ' : ''} ${el.name}`)} (
            {dashboardAdherents.adherentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} adhérent
            {dashboardAdherents.adherentCount > 1 && 's'})
          </Box>
        </Box>
      )
    }
    if (errorMessage) {
      return <ErrorComponent errorMessage={errorMessage} />
    }
    return <Loader />
  }

  return <>{dashboardAdherentsContent()}</>
}

export default TextChart
