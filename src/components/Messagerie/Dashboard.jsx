import { useNavigate } from 'react-router-dom'
import { Container, Grid } from '@mui/material'
import KpiEmailCampaign from 'components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaigns from 'components/Dashboard/Charts/SentEmailCampaigns/SentEmailCampaigns'
import SendIcon from '@mui/icons-material/Send'
import { paths as messageriePaths } from 'components/Messagerie/shared/paths'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import PageHeader from 'ui/PageHeader'
import { useCurrentDeviceType } from 'components/shared/device/hooks'

const messages = {
  title: 'Messagerie',
  sendEmail: 'Envoyer un email',
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { isMobile } = useCurrentDeviceType()

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
        <PageHeader
          title={messages.title}
          button={
            <PageHeaderButton
              onClick={() => navigate(messageriePaths.create)}
              label={messages.sendEmail}
              icon={<SendIcon />}
              isMainButton
            />
          }
        />
      </Grid>
      <KpiEmailCampaign />
      <Grid container>
        <Grid item xs={12}>
          <SentEmailCampaigns />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
