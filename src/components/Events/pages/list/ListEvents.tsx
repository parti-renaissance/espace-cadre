import { Box, Card, Container, Grid, Link, Typography } from '@mui/material'
import PageHeader from '~/ui/PageHeader'
import { messages } from '~/components/Events/shared/constants'
import { OAUTH_HOST } from '~/shared/environments'

const ListEvents = () => (
  <Container maxWidth={'xl'} sx={{ mb: 3 }}>
    <Grid container justifyContent="space-between">
      <PageHeader title={messages.title} />
    </Grid>

    <Card sx={{ backgroundColor: '#ECE2FF', border: '1px solid #D4C2FF' }}>
      <Grid container alignItems="flex-start" justifyContent="space-between" sx={{ padding: '24px' }}>
        <Grid item xs={12} sm={10} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography
              variant="caption"
              sx={{
                backgroundColor: '#F7F2FF',
                color: '#714991',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              Nouveau
            </Typography>
          </Box>
          <Typography sx={{ color: '#714991', fontWeight: 500, fontSize: '16px' }}>
            Les événements sont maintenant gérés directement sur l&apos;espace militant depuis l&apos;onglet{' '}
            <Link href={`${OAUTH_HOST}/app/evenements`}>&quot;Événements&ldquo;</Link>
          </Typography>
        </Grid>
      </Grid>
    </Card>
  </Container>
)

export default ListEvents
