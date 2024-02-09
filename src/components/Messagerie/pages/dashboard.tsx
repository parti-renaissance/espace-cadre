import { useNavigate } from 'react-router-dom'
import { Box, Button, ButtonGroup, Container, Grid, Stack } from '@mui/material'
import { useState } from 'react'
import KpiEmailCampaign from '~/components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaigns from '~/components/Dashboard/Charts/SentEmailCampaigns/SentEmailCampaigns'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import PageHeader from '~/ui/PageHeader'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Templates from '../Templates'

import Iconify from '~/mui/iconify/'

const messages = {
  title: 'Echange',
  sendEmail: 'Écrire un email',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [showTemplates, setShowTemplates] = useState(false)
  const { isMobile } = useCurrentDeviceType()

  return (
    <Container maxWidth={false} sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Box>
        <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
          <PageHeader
            title={messages.title}
            button={
              <Stack alignItems="center" direction="row" spacing={2}>
                <ButtonGroup variant="contained" color="inherit" size="medium">
                  <Button
                    data-cy="ui-page-header-button"
                    startIcon={<Iconify icon="solar:pen-bold" color="white" />}
                    onClick={() => navigate(messageriePaths.create)}
                  >
                    {messages.sendEmail}
                  </Button>
                  <Button data-cy="templates-button" onClick={() => setShowTemplates(true)}>
                    <Iconify icon="eva:arrow-ios-downward-fill" color="white" />
                  </Button>
                </ButtonGroup>
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
