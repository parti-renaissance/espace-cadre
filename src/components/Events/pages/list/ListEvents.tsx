import { Button, Card, Container, Grid, SvgIcon, Typography } from '@mui/material'
import { OAUTH_HOST } from '~/shared/environments'
import eventFeatureImage from '~/assets/event_feature_desktop.png'
import eventFeatureMobileImage from '~/assets/event_feature_mobile.png'
import StartSvg from '~/assets/star.svg?react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

const ListEvents = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Container maxWidth={'xl'} sx={{ mb: 3 }}>
      <Card
        sx={{
          background: 'linear-gradient(90deg, #E9EDFF 0%, #FFE2E2 100%)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Grid
          container
          direction="column"
          sx={{ padding: '32px', alignItems: 'center', gap: '24px', maxWidth: '800px' }}
        >
          <Typography
            variant="caption"
            sx={{
              backgroundColor: '#ffffff',
              color: '#5E397C',
              padding: '5px 12px',
              borderRadius: '999px',
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Nouveau
          </Typography>

          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              fontWeight: 'medium',
              fontSize: '20px',
              color: '#674283',
              maxWidth: '500px',
            }}
          >
            Les événements sont maintenant gérés directement sur l&apos;espace militant depuis l&apos;onglet
            &quot;Événements&quot;
          </Typography>

          <Button
            href={`${OAUTH_HOST}/app/evenements`}
            variant="outlined"
            sx={{ background: '#9569BB', color: '#FFFFFF', width: 'fit-content' }}
          >
            {!isMobile && <SvgIcon component={StartSvg} />}
            Gérer mes événements depuis l’espace militant
          </Button>

          <img src={isMobile ? eventFeatureMobileImage : eventFeatureImage} alt="Event Militant" />
        </Grid>
      </Card>
    </Container>
  )
}

export default ListEvents
