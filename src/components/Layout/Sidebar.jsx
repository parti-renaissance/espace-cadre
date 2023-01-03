import PropTypes from 'prop-types'
import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, AppBar as MuiAppBar } from '@mui/material'
import Mobile from './Mobile'
import Navigation from './Navigation'
import Branding from './Branding'
import Logo from 'ui/Logo/Logo'
import Scopes from 'components/Scopes'
import Header from './Header'
import Footer from './Footer'

const drawerWidth = 284
const asideWidth = 54

const AppBar = styled(MuiAppBar)(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${theme.palette.colors.blue['500']};
`
)

const Sidebar = ({ children, window }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const container = window !== undefined ? () => window().document.body : undefined

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        sx={{
          backgroundColor: theme => theme.palette.colors.white,
          width: drawerWidth,
          display: {
            xs: 'none',
            lg: 'flex',
          },
        }}
      >
        <Box
          sx={{ width: asideWidth, backgroundColor: theme => theme.palette.colors.blue['600'] }}
          className="aside-navigation"
        >
          <Logo classes="h-4 w-auto" fillColor="#fff" strokeColor="#fff" />
          <Scopes />
        </Box>
        <Box
          sx={{
            flex: '1 1 0%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: drawerWidth - asideWidth,
            padding: '20px 16px',
          }}
        >
          <Navigation drawerWidth={drawerWidth - asideWidth} />
          <Footer />
        </Box>
      </Box>
      <Mobile
        container={container}
        drawerWidth={drawerWidth - asideWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        sx={{
          flexGrow: 1,
          width: '100%',
          overflowY: 'scroll',
          backgroundColor: theme => theme.palette.colors.gray['100'],
        }}
      >
        <AppBar position="fixed" sx={{ display: { lg: 'none' } }}>
          <Branding handleDrawerToggle={handleDrawerToggle} />
        </AppBar>
        <Header />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 2,
            mt: {
              xs: '100px',
              lg: '0',
            },
            flex: '1 1 0%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  window: PropTypes.string,
}
