import { Drawer as MuiDrawer, Box } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import Scopes from '../Scopes'
import Branding from './Branding'
import NavMenu from './NavMenu'
import Footer from './Footer'
import Logo from 'ui/Logo/Logo'
import Desktop from './Desktop'

const BrandingWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(1.5, 3.5)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Drawer = styled(MuiDrawer)`
  & .MuiDrawer-paper {
    background-color: #fff;
  }
`

export const Mobile = ({ mobileOpen, container, handleDrawerToggle, drawerWidth }) => (
  <Drawer
    container={container}
    variant="temporary"
    open={mobileOpen}
    onClose={handleDrawerToggle}
    ModalProps={{
      keepMounted: true,
    }}
    sx={{
      display: { xs: 'block', lg: 'none' },
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
      },
    }}
  >
    {/* <BrandingWrapper onClick={handleDrawerToggle}>
      <Branding mobileOpen />
    </BrandingWrapper> */}
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box
        sx={{
          width: 54,
          backgroundColor: '#1254D8',
        }}
        className="aside-navigation"
      >
        <Logo classes="h-4 w-auto" fillColor="#fff" strokeColor="#fff" />
        <Scopes />
      </Box>
      <Box
        sx={{
          flex: '1 1 0%',
          width: drawerWidth,
          padding: '20px 16px',
        }}
      >
        <Desktop drawerWidth={drawerWidth} />
      </Box>
    </Box>
    {/* <div style={{ padding: '20px 16px' }}>
      <Scopes />
      <NavMenu handleItemClick={handleDrawerToggle} />
      <Footer />
    </div> */}
  </Drawer>
)

export default Mobile

Mobile.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  container: PropTypes.number,
  handleDrawerToggle: PropTypes.func.isRequired,
}
