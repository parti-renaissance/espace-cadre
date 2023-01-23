import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import Navigation from './Navigation'

export const Desktop = ({ drawerWidth, asideWidth }) => (
  <Box
    sx={{
      backgroundColor: theme => theme.palette.colors.white,
      width: drawerWidth + asideWidth,
      display: {
        xs: 'none',
        lg: 'flex',
      },
    }}
    className="sidebar"
  >
    <Navigation {...{ drawerWidth, asideWidth }} />
  </Box>
)

export default Desktop

Desktop.propTypes = {
  drawerWidth: PropTypes.number,
  asideWidth: PropTypes.number,
}
