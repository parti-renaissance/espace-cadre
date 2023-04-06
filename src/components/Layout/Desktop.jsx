import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import Navigation from './Navigation'

export const Desktop = ({ drawerWidth }) => (
  <Box
    sx={{
      backgroundColor: 'colors.white',
      width: 'min-content',
      display: {
        xs: 'none',
        lg: 'block',
      },
    }}
    className="sidebar"
  >
    <Navigation drawerWidth={drawerWidth} />
  </Box>
)

export default Desktop

Desktop.propTypes = {
  drawerWidth: PropTypes.number,
}
