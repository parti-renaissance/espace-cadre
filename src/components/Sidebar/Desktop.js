import PropTypes from 'prop-types'
import { Drawer } from '@mui/material'
import { styled } from '@mui/system'
import banner from 'assets/banner.svg'
import frenchFlag from 'assets/frenchFlag.svg'
import MentionsLegales from './MentionsLegales'
import Scopes from '../Scopes'
import Branding from './Branding'

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
  title: "Je m'engage",
}

const Desktop = ({ drawer }) => (
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
    <Branding />
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
}

export default Desktop
