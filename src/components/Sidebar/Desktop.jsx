import PropTypes from 'prop-types'
import { Drawer as MuiDrawer, Box } from '@mui/material'
import NavMenu from './NavMenu'
import Footer from './Footer'

const Desktop = ({ drawerWidth }) => (
  <Box
    sx={{
      width: '100%',
    }}
  >
    <NavMenu />
    {/* <Footer /> */}
  </Box>
)

Desktop.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
}

export default Desktop
