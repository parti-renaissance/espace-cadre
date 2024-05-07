import PropTypes from 'prop-types'
import { useState } from 'react'
import { styled } from '@mui/system'
import { Box, AppBar as MuiAppBar } from '@mui/material'

import Mobile from './Mobile'
import Desktop from './Desktop'
import Branding from './Branding'

import useDrawerStore from '~/stores/drawerStore'

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
  const { fullscreen, hideNav } = useDrawerStore()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box sx={{ minHeight: '100%', position: 'relative', display: 'flex' }}>
      {fullscreen || hideNav ? null : (
        <>
          <Desktop drawerWidth={drawerWidth} />
          <Mobile
            container={container}
            drawerWidth={drawerWidth}
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        </>
      )}
      <Box
        sx={{
          flexGrow: 1,
          padding:
            fullscreen || hideNav
              ? undefined
              : {
                  lg: `0 0 0 ${drawerWidth}px`,
                },
        }}
      >
        {fullscreen ? null : (
          <>
            {hideNav ? null : (
              <AppBar position="fixed" sx={{ display: { lg: 'none' } }}>
                <Branding handleDrawerToggle={handleDrawerToggle} />
              </AppBar>
            )}
          </>
        )}

        {fullscreen ? (
          <Box height="100%">{children}</Box>
        ) : (
          <Box component="main" height="100%" className="app-content">
            {children}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Sidebar

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  window: PropTypes.string,
}
