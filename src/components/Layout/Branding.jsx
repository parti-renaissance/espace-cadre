import { styled } from '@mui/system'
import { Typography, Toolbar } from '@mui/material'
import ListIcon from '~/ui/icons/ListIcon'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'

const BrandingWrapper = styled(Toolbar)(
  ({ theme }) => `
    display: flex;
    color: ${theme.palette.menu.color.main};
    padding: 0;
  `
)

const SiteName = styled(Typography)(
  ({ theme }) => `
    font-family: MaaxItalic;
    font-size: 22px;
    font-weight: 600;
    margin-right: ${theme.spacing(0.5)}
  `
)

const IconWrapper = styled('span')(
  ({ theme }) => `
    margin-right: ${theme.spacing(1.5)};
    margin: ${theme.spacing(1, 1.5, 0, 0)}
  `
)

const messages = {
  siteName: 'Espace cadre',
}

const Branding = ({ mobileOpen = false, handleDrawerToggle }) => (
  <BrandingWrapper onClick={handleDrawerToggle}>
    <IconWrapper>{mobileOpen ? <CloseIcon sx={{ mt: 0.5 }} /> : <ListIcon titleAccess="Menu button" />}</IconWrapper>
    <SiteName>{messages.siteName}</SiteName>
  </BrandingWrapper>
)

export default Branding

Branding.propTypes = {
  mobileOpen: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
}
