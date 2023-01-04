import { Box } from '@mui/material'
import PropTypes from 'prop-types'

import Scopes from '../Scopes'
import Logo from 'ui/Logo/Logo'
import Navigation from './Navigation'
import Footer from './Footer'

export const Desktop = ({ asideWidth, drawerWidth }) => (
  <Box
    sx={{
      backgroundColor: theme => theme.palette.colors.white,
      width: drawerWidth,
      display: {
        xs: 'none',
        lg: 'flex',
      },
    }}
    className="sidebar"
  >
    <Box
      sx={{ width: asideWidth, backgroundColor: theme => theme.palette.colors.blue['600'] }}
      className="aside-navigation"
    >
      <Logo classes="h-4 w-auto" fillColor="#fff" strokeColor="#fff" />
      <Scopes />
    </Box>
    <Box
      sx={{
        flex: '1 1 0%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: drawerWidth - asideWidth,
        padding: '20px 16px',
      }}
    >
      <Navigation drawerWidth={drawerWidth - asideWidth} />
      <Footer />
    </Box>
  </Box>
)

export default Desktop

Desktop.propTypes = {
  drawerWidth: PropTypes.number,
  asideWidth: PropTypes.number,
}
