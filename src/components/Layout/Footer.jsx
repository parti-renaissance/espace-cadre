import MentionsLegales from './MentionsLegales'
import { styled } from '@mui/system'
import { Grid } from '@mui/material'
import { APP_VERSION } from 'shared/environments'

const FooterWrapper = styled('div')`
  margin: ${({ theme }) => theme.spacing('auto', 0, 2, 2)};
`

const ReleaseVersion = styled('div')(
  ({ theme }) => `
  font-family: MaaxItalic;
  color: ${theme.palette.mentionsLegales};
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
`
)

const Signature = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.mentionsLegales};
  font-size: 10px;
  margin: ${theme.spacing(1, 2, 0, 0)};
`
)

const messages = {
  title: "Je m'engage",
  signature: 'Designé et assemblé par le Pôle Tech & Innovation',
}

const Footer = () => (
  <FooterWrapper>
    <Grid container alignItems="center">
      <MentionsLegales />
      <ReleaseVersion>
        {messages.title}@{APP_VERSION}
      </ReleaseVersion>
    </Grid>
    <Signature>{messages.signature}</Signature>
  </FooterWrapper>
)

export default Footer
