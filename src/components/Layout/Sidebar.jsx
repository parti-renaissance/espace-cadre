import PropTypes from 'prop-types'
import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, AppBar as MuiAppBar } from '@mui/material'

import { useUserScope } from '../../redux/user/hooks'
import Mobile from './Mobile'
import Desktop from './Desktop'
import Branding from './Branding'
import Header from './Header'

const drawerWidth = 284

const AppBar = styled(MuiAppBar)(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  height: 64px;
  background-color: ${theme.palette.colors.blue['500']};
`
)

const Sidebar = ({ children, window }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const container = window !== undefined ? () => window().document.body : undefined
  const [currentScope] = useUserScope()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ minHeight: '100%', position: 'relative', display: 'flex', backgroundColor: 'colors.gray.100' }}>
      <Desktop drawerWidth={drawerWidth} />
      <Mobile
        container={container}
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        sx={{
          flexGrow: 1,
          padding: {
            lg: `0 0 0 ${drawerWidth}px`,
          },
        }}
      >
        <AppBar position="fixed" sx={{ display: { lg: 'none' } }}>
          <Branding handleDrawerToggle={handleDrawerToggle} />
          <span className="badge badge-light badge-sm">
            {currentScope?.name} ({currentScope?.zones[0]?.code})
          </span>
        </AppBar>
        <Header />
        <Box component="main" height="100%" className="app-content">
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
