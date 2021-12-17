import { Drawer as MuiDrawer } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Scopes from '../Scopes'
import Branding from './Branding'
import Footer from './Footer'

const BrandingWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Drawer = styled(MuiDrawer)`
  & .MuiDrawer-paper {
    background: ${({ theme }) => theme.palette.menu.background.main};
  }
`

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
    }}
  >
    <BrandingWrapper onClick={handleDrawerToggle}>
      <Branding mobileOpen />
    </BrandingWrapper>
    <Scopes />
    {drawer}
    <Footer />
  </Drawer>
)

export default Mobile

Mobile.propTypes = {
  drawer: PropTypes.node.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
}
