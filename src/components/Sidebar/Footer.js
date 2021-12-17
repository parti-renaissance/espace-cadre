import React from 'react'
import MentionsLegales from './MentionsLegales'
import { styled } from '@mui/system'

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

const Footer = () => (
  <FooterWrapper>
    <MentionsLegales />
    <ReleaseVersion>
      {messages.title}@{process.env.REACT_APP_VERSION}
    </ReleaseVersion>
  </FooterWrapper>
)

export default Footer
