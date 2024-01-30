import { useNavigate } from 'react-router-dom'
import { Box, Container, Grid } from '@mui/material'
import { useState } from 'react'
import SendIcon from '@mui/icons-material/Send'
import GridViewIcon from '@mui/icons-material/GridView'
import KpiEmailCampaign from '~/components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaigns from '~/components/Dashboard/Charts/SentEmailCampaigns/SentEmailCampaigns'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import PageHeader from '~/ui/PageHeader'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import Templates from './Templates'

const messages = {
  title: 'Messagerie',
  sendEmail: 'Envoyer un email',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const [showTemplates, setShowTemplates] = useState(false)
  const { isMobile } = useCurrentDeviceType()

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
        <PageHeader
          title={messages.title}
          button={
            <Box display="flex" alignItems="center" className="space-x-3">
              <PageHeaderButton
                onClick={() => setShowTemplates(true)}
                label="Modèles"
                icon={<GridViewIcon />}
                data-cy="templates-button"
                isMainButton
              />
              <PageHeaderButton
                onClick={() => navigate(messageriePaths.create)}
                label={messages.sendEmail}
                icon={<SendIcon />}
                isMainButton
              />
            </Box>
          }
        />
      </Grid>
      <KpiEmailCampaign />
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
