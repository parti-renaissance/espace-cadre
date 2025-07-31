import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Grid, Stack, Typography, Card } from '@mui/material'
import { useState } from 'react'
import KpiEmailCampaign from '~/components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaigns from '~/components/Dashboard/Charts/SentEmailCampaigns/SentEmailCampaigns'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import PageHeader from '~/ui/PageHeader'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Templates from '../Templates'
import { FeatureEnum } from '~/models/feature.enum'

import Iconify from '~/mui/iconify/'
import { useUserScope } from '~/redux/user/hooks'

const messages = {
  title: 'Échange',
  sendEmail: 'Écrire un email',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [showTemplates, setShowTemplates] = useState(false)
  const { isMobile } = useCurrentDeviceType()
  const [currentScope] = useUserScope()

  const isPublicationsFeatureEnabled = currentScope.hasFeature(FeatureEnum.PUBLICATIONS)

  return (
    <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {isPublicationsFeatureEnabled && (
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
                Utilisez maintenant les publications plutôt que les emails classiques. Directement depuis l&apos;espace
                militant, elles sont plus faciles à concevoir et vos publications sont à la fois envoyées par email et
                visibles sur l&apos;accueil de l&apos;espace de vos militants !
              </Typography>
              <Grid marginTop={2}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  data-cy="ui-page-header-button"
                  sx={{
                    backgroundColor: '#714991',
                    '&:hover': { backgroundColor: '#5A3B7A' },
                  }}
                  startIcon={<Iconify icon="solar:document-text-bold" />}
                  onClick={() => window.open('https://app.parti-renaissance.fr/publications', '_blank')}
                >
                  J&apos;essaye les publications
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Card>
      )}
      <Box>
        <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
          <PageHeader
            title={messages.title}
            button={
              <Stack alignItems="center" direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="inherit"
                  size="medium"
                  data-cy="ui-page-header-button"
                  startIcon={<Iconify icon="solar:pen-bold" color="white" />}
                  onClick={() => navigate(`${messageriePaths.create}/${messageriePaths.createNewsletter}`)}
                >
                  {messages.sendEmail}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="medium"
                  data-cy="templates-button"
                  onClick={() => setShowTemplates(true)}
                >
                  À partir d&apos;une template
                </Button>
              </Stack>
            }
          />
        </Grid>
        <div>
          <KpiEmailCampaign />
        </div>
      </Box>
      <Grid container>
        <Grid item xs={12}>
          <SentEmailCampaigns />
        </Grid>
      </Grid>

      {showTemplates && <Templates handleClose={() => setShowTemplates(false)} />}
    </Container>
  )
}

export default Dashboard
