import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, Toolbar, AppBar as MuiAppBar, Typography as MuiTypography } from '@mui/material'
import { NavItem } from 'ui'
import { ListIcon } from 'ui/icons/ListIcon'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from '../../redux/user/selectors'
import Mobile from './Mobile'
import Desktop from './Desktop'
import pages from 'shared/authorizedPages'
import paths from 'shared/paths'
import icons from 'components/Sidebar/shared/icons'
import colors from 'components/Sidebar/shared/colors'

const AppBar = styled(MuiAppBar)(
  ({ theme }) => `
  flex-direction: row;
  background-color: ${theme.palette.menu.background.main};
`
)

const IconWrapper = styled('span')(
  ({ theme }) => `
    margin: ${theme.spacing(3.5, 1.5, 2.5, 3.5)}
`
)

const Typography = styled(MuiTypography)(
  ({ theme }) => `
  font-size: 22px;
  font-weight: 600;
  margin: ${theme.spacing(3.5, 1.5, 3.5, 0)}
`
)

const navInfo = id => ({
  path: paths[id],
  icon: icons[id],
  color: colors[id].color,
  bgcolor: colors[id].bgColor,
})

const messages = {
  siteName: "Je m'engage",
}

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const authorizedPages = useSelector(getAuthorizedPages)
  const drawerWidth = 275

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
        <IconWrapper onClick={handleDrawerToggle}>
          <ListIcon alt="Menu button" />
        </IconWrapper>
        <Typography>{messages.siteName}</Typography>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Mobile drawer={drawer} handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} />
        <Desktop drawer={drawer} siteName={messages.siteName} />
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, display: { sm: 'none' } }}
      >
        <Toolbar />
      </Box>
    </Box>
  )
}

export default Sidebar
