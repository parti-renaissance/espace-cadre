import { Box, Typography } from '@mui/material'
import { useUserScope } from '../../../../redux/user/hooks'
import pluralize from 'components/shared/pluralize/pluralize'
import { useQuery } from 'react-query'
import { adherentsCount } from 'api/dashboard'
import { DASHBOARD_CACHE_DURATION } from 'components/Dashboard/shared/cache'
import Loading from 'components/Dashboard/shared/Loading'
import Error from 'components/Dashboard/shared/Error'

const messages = {
  adherent: 'adhérent',
  errorMessage: 'Les données des adhérents sont indisponibles',
}

const TextChart = () => {
  const [currentScope] = useUserScope()

  const {
    data: adherents = null,
    isLoading,
    isError,
  } = useQuery('adherents', adherentsCount, {
    cacheTime: DASHBOARD_CACHE_DURATION,
    staleTime: DASHBOARD_CACHE_DURATION,
  })

  if (isLoading) return <Loading />
  if (isError) return <Error message={messages.errorMessage} />

  return (
    <Box mb={2} sx={{ color: 'blackCorner' }}>
      <Typography variant="subtitle1">
        {currentScope.name} &gt;
        {currentScope.zones && currentScope.zones.map((el, index) => `${index ? ', ' : ''} ${el.name}`)} (
        {adherents.adherentCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}&nbsp;
        {pluralize(adherents.adherentCount, messages.adherent)})
      </Typography>
    </Box>
  )
}

export default TextChart
