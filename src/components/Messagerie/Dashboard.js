import { useNavigate } from 'react-router-dom'
import { Container, Grid } from '@mui/material'
import KpiEmailCampaign from 'components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaigns from 'components/Dashboard/Charts/SentEmailCampaigns/SentEmailCampaigns'
import SendIcon from '@mui/icons-material/Send'
import paths from 'components/Messagerie/shared/paths'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import PageHeader from 'ui/PageHeader'

const messages = {
  title: 'Messagerie',
  sendEmail: 'Envoyer un email',
}

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            <PageHeaderButton onClick={() => navigate(paths.create)} label={messages.sendEmail} icon={<SendIcon />} />
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
