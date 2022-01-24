import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, AppBar as MuiAppBar, Toolbar } from '@mui/material'
import NavItem from 'ui/NavItem/NavItem'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from '../../redux/user/selectors'
import Mobile from './Mobile'
import Desktop from './Desktop'
import pages from 'shared/authorizedPages'
import paths from 'shared/paths'
import icons from 'components/Sidebar/shared/icons'
import colors from 'components/Sidebar/shared/colors'
import Branding from './Branding'
import PropTypes from 'prop-types'

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

const navInfo = id => ({
  path: paths[id],
  icon: icons[id],
  color: colors[id].color,
  bgcolor: colors[id].bgColor,
})

const Sidebar = ({ children, window }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const authorizedPages = useSelector(getAuthorizedPages)
  const container = window !== undefined ? () => window().document.body : undefined

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div sx={{ display: 'flex', flexDirection: 'column' }}>
      {authorizedPages.includes(pages.dashboard) && <NavItem label="Vue d'ensemble" {...navInfo('dashboard')} />}
      {authorizedPages.includes(pages.activists) && <NavItem label="Militants" {...navInfo('activists')} />}
      {authorizedPages.includes(pages.messagerie) && <NavItem label="Messagerie" {...navInfo('messagerie')} />}
      {authorizedPages.includes(pages.elections) && <NavItem label="&Eacute;lections" {...navInfo('elections')} />}
      {authorizedPages.includes(pages.ripostes) && <NavItem label="Riposte" {...navInfo('ripostes')} />}
      {authorizedPages.includes(pages.groups) && <NavItem label="Groupes" {...navInfo('groups')} />}
      {authorizedPages.includes(pages.news) && <NavItem label="Actualités" {...navInfo('news')} />}
      {authorizedPages.includes(pages.phoning) && <NavItem label="Phoning" {...navInfo('phoning')} />}
      {authorizedPages.includes(pages.DTD) && <NavItem label="Porte à porte" {...navInfo('DTD')} />}
      {authorizedPages.includes(pages.surveys) && <NavItem label="Questionnaires" {...navInfo('surveys')} />}
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
