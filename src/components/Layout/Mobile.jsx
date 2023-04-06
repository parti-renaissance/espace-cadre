import { Drawer as MuiDrawer } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
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
    <Navigation drawerWidth={drawerWidth} />
  </Drawer>
)

export default Mobile

Mobile.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  container: PropTypes.number,
  handleDrawerToggle: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number,
}
