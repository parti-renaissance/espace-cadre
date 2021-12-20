import MentionsLegales from './MentionsLegales'
import { styled } from '@mui/system'

const FooterWrapper = styled('div')`
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 28px;
  margin-left: 16px;
  flex-wrap: wrap;
`

const ReleaseVersion = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.mentionsLegales};
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
`
)

const Signature = styled('div')`
  color: ${({ theme }) => theme.palette.mentionsLegales};
  font-size: 10px;
  margin: ${({ theme }) => theme.spacing(1, 2, 0, 0)};
`

const messages = {
  title: "Je m'engage",
  signature: 'Designé et assemblé par le Pôle Tech & Innovation',
}

const Footer = () => (
  <FooterWrapper>
    <MentionsLegales />
    <ReleaseVersion>
      {messages.title}@{process.env.REACT_APP_VERSION}
    </ReleaseVersion>
    <Signature>{messages.signature}</Signature>
  </FooterWrapper>
)

export default Footer
