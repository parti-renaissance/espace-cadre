import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Drawer as MuiDrawer } from '@mui/material'
import frenchFlag from 'assets/frenchFlag.svg'
import Scopes from '../Scopes'
import Branding from './Branding'
import NavMenu from './NavMenu'
import Footer from './Footer'

const Drawer = styled(MuiDrawer)`
  & .MuiDrawer-paper {
    background: ${({ theme }) => theme.palette.menu.background.main};
  }
  & .MuiPaper-root {
    border: none;
  }
`

const Desktop = ({ drawerWidth }) => (
  <Drawer
    variant="permanent"
    sx={{
      display: { xs: 'none', sm: 'block' },
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width: '100%',
      },
    }}
    open
  >
    <img src={frenchFlag} alt="drapeau france" />
    <Branding />
    <Scopes />
    <NavMenu />
    <Footer />
  </Drawer>
)

Desktop.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
}

export default Desktop
