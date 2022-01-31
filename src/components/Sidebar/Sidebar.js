import PropTypes from 'prop-types'
import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, AppBar as MuiAppBar, Toolbar } from '@mui/material'
import NavItem from 'ui/NavItem/NavItem'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from '../../redux/user/selectors'
import Mobile from './Mobile'
import Desktop from './Desktop'
import paths from 'shared/paths'
import features, { featuresLabels } from 'shared/features'
import icons from 'components/Sidebar/shared/icons'
import colors from 'components/Sidebar/shared/colors'
import Branding from './Branding'

const drawerWidth = 275

const AppBar = styled(MuiAppBar)(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing(1.5, 3.5)};
  background-color: ${theme.palette.menu.background.main};
`
)

const navInfo = featureId => ({
  path: paths[featureId],
  icon: icons[featureId],
  color: colors[featureId].color,
  bgcolor: colors[featureId].bgColor,
  label: featuresLabels[featureId],
})

const Sidebar = ({ children, window }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const authorizedFeatures = useSelector(getAuthorizedPages)
  const container = window !== undefined ? () => window().document.body : undefined

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div>
      {authorizedFeatures.includes(features.dashboard) && <NavItem {...navInfo(features.dashboard)} />}
      {authorizedFeatures.includes(features.contacts) && <NavItem {...navInfo(features.contacts)} />}
      {authorizedFeatures.includes(features.messages) && <NavItem {...navInfo(features.messages)} />}
      {authorizedFeatures.includes(features.elections) && <NavItem {...navInfo(features.elections)} />}
      {authorizedFeatures.includes(features.ripostes) && <NavItem {...navInfo(features.ripostes)} />}
      {authorizedFeatures.includes(features.team) && <NavItem {...navInfo(features.team)} />}
      {authorizedFeatures.includes(features.news) && <NavItem {...navInfo(features.news)} />}
      {authorizedFeatures.includes(features.events) && <NavItem {...navInfo(features.events)} />}
      {authorizedFeatures.includes(features.survey) && <NavItem {...navInfo(features.survey)} />}
      {authorizedFeatures.includes(features.phoning_campaign) && <NavItem {...navInfo(features.phoning_campaign)} />}
      {authorizedFeatures.includes(features.pap) && <NavItem {...navInfo(features.pap)} />}
      {authorizedFeatures.includes(features.my_team) && <NavItem {...navInfo(features.my_team)} />}
    </div>
  )
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          display: { sm: 'none' },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Branding handleDrawerToggle={handleDrawerToggle} />
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Mobile
          drawer={drawer}
          container={container}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
        />
        <Desktop drawer={drawer} drawerWidth={drawerWidth} mobileOpen={mobileOpen} />
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar sx={{ p: 2, display: { sm: 'none' } }} />
        {children}
      </Box>
    </Box>
  )
}

export default Sidebar

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  window: PropTypes.string,
}
