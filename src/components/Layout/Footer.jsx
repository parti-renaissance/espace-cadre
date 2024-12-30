import MentionsLegales from './MentionsLegales'
import { styled } from '@mui/system'
import { Button, Grid, Stack } from '@mui/material'
import { APP_VERSION } from '~/shared/environments'
import { useSelector } from 'react-redux'
import { getFeaturebaseToken } from '~/redux/user/selectors.js'

const FooterWrapper = styled('div')`
  padding: ${({ theme }) => theme.spacing(1, 2)};
`

const ReleaseVersion = styled('div')(
  ({ theme }) => `
  font-family: Maax;
  color: ${theme.palette.mentionsLegales};
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
`
)

const Signature = styled('div')(
  ({ theme }) => `
  color: ${theme.palette.colors.gray['600']};
  font-size: 10px;
  margin: ${theme.spacing(1, 2, 0, 0)};
`
)

const messages = {
  title: 'Espace cadre',
  signature: 'Designé et assemblé par le Pôle Tech & Innovation',
}

const Footer = () => {
  const featurebaseToken = useSelector(getFeaturebaseToken)

  return (
    <FooterWrapper>
      <Grid container alignItems="center" sx={{ color: 'mentionsLegales' }}>
        <MentionsLegales />
        <ReleaseVersion>
          {messages.title}@{APP_VERSION}
        </ReleaseVersion>
        {featurebaseToken && (
          <Stack spacing={1}>
            <Button color="secondary" variant="outlined" data-featurebase-changelog size="small">
              📣 Dernières nouveautés
            </Button>
            <Button color="primary" variant="outlined" data-featurebase-feedback size="small">
              🪃 Nous faire un retour
            </Button>
          </Stack>
        )}
      </Grid>
      <Signature>{messages.signature}</Signature>
    </FooterWrapper>
  )
}

export default Footer
