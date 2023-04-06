import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { LogoLarge } from 'ui/Logo/Logo'
import { featuresGroup } from 'shared/features'
import Scopes from '../Scopes'
import NavMenu from './NavMenu'
import Footer from './Footer'
import { useUserScope } from '../../redux/user/hooks'

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
      <div>
        <LogoLarge classes="h-6 w-auto" fillColor="#1254D8" strokeColor="#1254D8" />
        <Scopes />
      </div>
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
