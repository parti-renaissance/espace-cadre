import PropTypes from 'prop-types'
import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, AppBar as MuiAppBar, Toolbar } from '@mui/material'
import Mobile from './Mobile'
import Desktop from './Desktop'
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

const Sidebar = ({ children, window }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const container = window !== undefined ? () => window().document.body : undefined

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

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
        <Desktop drawerWidth={drawerWidth} />
        <Mobile
          container={container}
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
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
