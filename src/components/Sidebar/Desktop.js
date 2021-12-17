import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import { Drawer as MuiDrawer } from '@mui/material'
import banner from 'assets/banner.svg'
import frenchFlag from 'assets/frenchFlag.svg'
import Scopes from '../Scopes'
import Branding from './Branding'
import Footer from './Footer'

const Drawer = styled(MuiDrawer)`
  position: relative;
  & .MuiDrawer-paper {
    background: ${({ theme }) => theme.palette.menu.background.main};
  }
  & .MuiPaper-root {
    border: none;
  }
`

const Desktop = ({ drawer }) => (
  <Drawer
    variant="permanent"
    sx={{
      display: { xs: 'none', sm: 'block' },
    }}
    open
  >
    <img src={banner} alt="Emmanuel Macron" />
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
