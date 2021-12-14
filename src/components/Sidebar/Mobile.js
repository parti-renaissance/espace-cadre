import { Drawer } from '@mui/material'
import PropTypes from 'prop-types'

export const Mobile = ({ drawer, handleDrawerToggle, mobileOpen }) => (
  <Drawer
    variant="temporary"
    open={mobileOpen}
    onClose={handleDrawerToggle}
    ModalProps={{
      keepMounted: true,
    }}
    sx={{
      display: { xs: 'block', sm: 'none' },
      '& .MuiDrawer-paper': { bgcolor: 'menu.background.main' },
    }}
  >
    {drawer}
  </Drawer>
)

export default Mobile

Mobile.propTypes = {
  drawer: PropTypes.node.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
}
