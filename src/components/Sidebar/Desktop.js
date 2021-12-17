import PropTypes from 'prop-types'
import { Drawer } from '@mui/material'
import banner from 'assets/banner.svg'
import frenchFlag from 'assets/frenchFlag.svg'
import Scopes from '../Scopes'
import Branding from './Branding'
import Footer from './Footer'

const Desktop = ({ drawer }) => (
  <Drawer
    variant="permanent"
    sx={{
      display: { xs: 'none', sm: 'block' },
      position: 'relative',
      '& .MuiDrawer-paper': {
        bgcolor: 'menu.background.main',
      },
      '& .MuiPaper-root': {
        border: 'none',
      },
    }}
    open
  >
    <img src={banner} alt="Macron photo" />
    <img src={frenchFlag} alt="drapeau france" />
    <Branding />
    <Scopes />
    {drawer}
    <Footer />
  </Drawer>
)

Desktop.propTypes = {
  drawer: PropTypes.node.isRequired,
}

export default Desktop
