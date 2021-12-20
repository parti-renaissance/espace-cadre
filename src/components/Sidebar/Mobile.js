import { Drawer as MuiDrawer } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Scopes from '../Scopes'
import Branding from './Branding'
import Footer from './Footer'

const BrandingWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(1.5, 3.5)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Drawer = styled(MuiDrawer)`
  & .MuiDrawer-paper {
    background: ${({ theme }) => theme.palette.menu.background.main};
  }
`

export const Mobile = ({ drawer, handleDrawerToggle, mobileOpen, container }) => (
  <Drawer
    container={container}
    variant="temporary"
    open={mobileOpen}
    onClose={handleDrawerToggle}
    ModalProps={{
      keepMounted: true,
    }}
    sx={{
      display: { xs: 'block', sm: 'none' },
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
      },
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
  container: PropTypes.number,
}
