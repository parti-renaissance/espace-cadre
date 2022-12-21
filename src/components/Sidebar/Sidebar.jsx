import PropTypes from 'prop-types'
import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, AppBar as MuiAppBar, Toolbar } from '@mui/material'
import Mobile from './Mobile'
import Desktop from './Desktop'
import Branding from './Branding'
import Logo from 'ui/Logo/Logo'
import Scopes from 'components/Scopes'

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
          backgroundColor: '#fff',
          width: drawerWidth,
          display: {
            xs: 'none',
            lg: 'flex',
          },
        }}
      >
        <Box
          sx={{
            width: asideWidth,
            backgroundColor: '#1254D8',
          }}
          className="aside-navigation"
        >
          <Logo classes="h-4 w-auto" fillColor="#fff" strokeColor="#fff" />
          <Scopes />
        </Box>
        <Box
          sx={{
            flex: '1 1 0%',
            width: drawerWidth - asideWidth,
            padding: '20px 16px',
          }}
        >
          <Desktop drawerWidth={drawerWidth - asideWidth} />
        </Box>
      </Box>
      <Mobile
        container={container}
        drawerWidth={drawerWidth - asideWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box sx={{ flexGrow: 1, width: '100%', overflowY: 'scroll', backgroundColor: '#f1f5f9' }}>
        <AppBar position="fixed" sx={{ display: { lg: 'none' } }}>
          <Branding handleDrawerToggle={handleDrawerToggle} />
        </AppBar>
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
