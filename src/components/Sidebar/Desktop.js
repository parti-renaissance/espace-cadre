import PropTypes from 'prop-types'
import { Drawer, Typography } from '@mui/material'
import { styled } from '@mui/system'
import banner from 'assets/banner.svg'
import frenchFlag from 'assets/frenchFlag.svg'
import { ListIcon } from 'ui/icons/ListIcon'
import MentionsLegales from './MentionsLegales'
import Scopes from '../Scopes'

const BrandingWrapper = styled('div')(
  ({ theme }) => `
  display: flex;
  color: ${theme.palette.menu.color.main};
  margin: ${theme.spacing(3, 'auto', 4, 'auto')};
`
)

const SiteName = styled(Typography)(
  ({ theme }) => `
  font-size: 22px;
  font-weight: 600;
  margin-right: ${theme.spacing(0.5)}
`
)

const BetaWrapper = styled('span')(
  ({ theme }) => `
  background: ${theme.palette.menu.background.beta};
  padding: ${theme.spacing(0, 0.37, 0.4)};
  border-radius: 4px;
  line-height: 12px;
  height: 12px;
`
)

const Beta = styled(Typography)`
  font-size: 8px;
  font-weight: 500;
`

const IconWrapper = styled('span')(
  ({ theme }) => `
margin-right: ${theme.spacing(1.5)};
margin-top: 5px;
`
)

const FooterWrapper = styled('div')`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 28px;
  margin-left: 16px;
`

const ReleaseVersion = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.mentionsLegales};
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
`
)

const messages = {
  beta: 'BÊTA',
  title: "Je m'engage",
}

const Desktop = ({ drawer, siteName }) => (
  <Drawer
    variant="permanent"
    sx={{
      display: { xs: 'none', sm: 'block' },
      position: 'relative',
      '& .MuiDrawer-paper': {
        bgcolor: 'menu.background.main',
      },
    }}
    open
  >
    <img src={banner} alt="Macron photo" />
    <img src={frenchFlag} alt="drapeau france" />
    <BrandingWrapper>
      <IconWrapper>
        <ListIcon alt="Menu button" />
      </IconWrapper>
      <SiteName>{siteName}</SiteName>
      <BetaWrapper>
        <Beta>{messages.beta}</Beta>
      </BetaWrapper>{' '}
    </BrandingWrapper>
    <Scopes />
    {drawer}
    <FooterWrapper>
      <MentionsLegales />
      <ReleaseVersion>
        {messages.title}@{process.env.REACT_APP_VERSION}
      </ReleaseVersion>
    </FooterWrapper>
  </Drawer>
)

Desktop.propTypes = {
  drawer: PropTypes.node.isRequired,
  siteName: PropTypes.string.isRequired,
}

export default Desktop
