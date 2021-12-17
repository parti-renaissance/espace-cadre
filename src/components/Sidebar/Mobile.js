import { Drawer } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Scopes from '../Scopes'
import Branding from './Branding'
import Footer from './Footer'
import MentionsLegales from './MentionsLegales'

const BrandingWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`
const FooterWrapper = styled('div')`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 28px;
  margin-left: 16px;
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
      '& .MuiDrawer-paper': { bgcolor: 'menu.background.main' },
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
