import { Drawer as MuiDrawer, Box } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Scopes from '../Scopes'
import Logo from 'ui/Logo/Logo'
import Navigation from './Navigation'

const Drawer = styled(MuiDrawer)`
  & .MuiDrawer-paper {
    background-color: ${({ theme }) => theme.palette.colors.white};
  }
`

export const Mobile = ({ mobileOpen, container, handleDrawerToggle, drawerWidth }) => (
  <Drawer
    container={container}
    variant="temporary"
    open={mobileOpen}
    onClose={handleDrawerToggle}
    ModalProps={{
      keepMounted: true,
    }}
    sx={{
      display: { xs: 'block', lg: 'none' },
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
      },
    }}
  >
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ width: 54, backgroundColor: theme => theme.palette.colors.blue['500'] }} className="aside-navigation">
        <Logo classes="h-4 w-auto" fillColor="#fff" strokeColor="#fff" />
        <Scopes />
      </Box>
      <Box
        sx={{
          flex: '1 1 0%',
          width: drawerWidth,
          padding: '20px 16px',
        }}
      >
        <Navigation drawerWidth={drawerWidth} />
      </Box>
    </Box>
  </Drawer>
)

export default Mobile

Mobile.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  container: PropTypes.number,
  handleDrawerToggle: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number,
}
