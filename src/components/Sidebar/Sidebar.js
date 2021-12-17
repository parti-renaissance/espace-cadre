import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, Toolbar, AppBar as MuiAppBar, Drawer } from '@mui/material'
import { NavItem } from 'ui'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from '../../redux/user/selectors'
import Mobile from './Mobile'
import Desktop from './Desktop'
import pages from 'shared/authorizedPages'
import paths from 'shared/paths'
import icons from 'components/Sidebar/shared/icons'
import colors from 'components/Sidebar/shared/colors'
import Branding from './Branding'

const drawerWidth = 275

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  background: theme.palette.menu.background.main,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

const BrandingContainer = styled('div')`
  margin-left: ${({ theme }) => theme.spacing(3.5)};
`

const navInfo = id => ({
  path: paths[id],
  icon: icons[id],
  color: colors[id].color,
  bgcolor: colors[id].bgColor,
})

const Sidebar = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const authorizedPages = useSelector(getAuthorizedPages)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }
  const drawer = (
    <div sx={{ display: 'flex', flexDirection: 'column' }}>
      {authorizedPages.includes(pages.dashboard) && <NavItem label="Vue d'ensemble" {...navInfo('dashboard')} />}
      {authorizedPages.includes(pages.adherents) && <NavItem label="Adhérents" {...navInfo('adherents')} />}
      {authorizedPages.includes(pages.messagerie) && <NavItem label="Messagerie" {...navInfo('messagerie')} />}
      {authorizedPages.includes(pages.elections) && <NavItem label="&Eacute;lections" {...navInfo('elections')} />}
      {authorizedPages.includes(pages.ripostes) && <NavItem label="Riposte" {...navInfo('ripostes')} />}
      {authorizedPages.includes(pages.teams) && <NavItem label="&Eacute;quipes" {...navInfo('teams')} />}
      {authorizedPages.includes(pages.news) && <NavItem label="Actualités" {...navInfo('news')} />}
      {authorizedPages.includes(pages.phoning) && <NavItem label="Phoning" {...navInfo('phoning')} />}
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          display: { sm: 'none' },
        }}
      >
        <BrandingContainer onClick={handleDrawerToggle}>
          <Branding />
        </BrandingContainer>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Mobile
          drawer={drawer}
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
        />
        <Desktop drawer={drawer} drawerWidth={drawerWidth} mobileOpen={mobileOpen} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}

export default Sidebar
