import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Stack } from '@mui/material'
import { featuresGroup } from '~/shared/features'
import Scopes from '../Scopes'
import NavMenu from './NavMenu'
import Footer from './Footer'
import { useUserScope } from '~/redux/user/hooks'
import { OAUTH_HOST } from '~/shared/environments'
import { styled } from '@mui/material/styles'

const VoxButton = styled(Button)({
  variant: 'outlined',
  backgroundColor: 'rgb(248, 240, 255)',
  color: '#9f60f0',
  '&:hover': {
    backgroundColor: '#f0eafa',
    color: '#9f60f0',
  },
  '&:visited': {
    color: '#9f60f0',
  },
})

const Navigation = ({ drawerWidth }) => {
  const [currentScope] = useUserScope()

  const authorizedFeaturesGroup = useMemo(
    () =>
      featuresGroup
        .map(group => {
          let arrayFeatures = []
          group.features.forEach(featureKey => {
            if (currentScope.hasFeature(featureKey)) {
              arrayFeatures.push(featureKey)
            }
          })

          return arrayFeatures.length ? { ...group, features: arrayFeatures } : null
        })
        .filter(group => group !== null),
    [currentScope]
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: drawerWidth,
        boxSizing: 'border-box',
        height: '100%',
        padding: '20px 16px',
        overflow: 'hidden',
      }}
    >
      <Stack spacing={{ xs: 1, sm: 2 }}>
        <div className="app-name">Espace cadre</div>
        <Scopes />
        <VoxButton
          href={`${OAUTH_HOST}/app`}
          startIcon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9f60f0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="font_unset "
              style={{ color: '#9f60f0' }}
            >
              <path d="m17 2 4 4-4 4" stroke="#9f60f0"></path>
              <path d="M3 11v-1a4 4 0 0 1 4-4h14" stroke="#9f60f0"></path>
              <path d="m7 22-4-4 4-4" stroke="#9f60f0"></path>
              <path d="M21 13v1a4 4 0 0 1-4 4H3" stroke="#9f60f0"></path>
            </svg>
          }
        >
          Espace militant
        </VoxButton>
      </Stack>
      <Box
        sx={{ mt: 1.5, pb: 2, flex: '1 1 0%', height: '100%', overflowY: 'scroll' }}
        className="space-y-4 sidebar-content"
      >
        {authorizedFeaturesGroup.map((group, key) => (
          <NavMenu key={key} group={group} />
        ))}
      </Box>
      <Footer />
    </Box>
  )
}

export default Navigation

Navigation.propTypes = {
  drawerWidth: PropTypes.number,
}
