import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'
import { Grid, Container, Typography } from '@mui/material'
import KpiEmailCampaign from 'components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaigns from 'components/Dashboard/Charts/SentEmailCampaigns/SentEmailCampaigns'
import SendIcon from '@mui/icons-material/Send'
import paths from 'components/Messagerie/shared/paths'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import PageHeader from 'ui/PageHeader'

const KPIContainer = styled(Grid)(
  ({ theme }) => `
  background-color: ${theme.palette.gray200};
  margin-bottom: ${theme.spacing(2)};
  border-radius: ${theme.spacing(1.5)};
`
)

const KPITitle = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.blackCorner};
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
`
)

const messages = {
  title: 'Messagerie',
  sendEmail: 'Envoyer un email',
  kpi: 'Indicateurs',
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
      <KPIContainer container>
        <Grid container>
          <Grid item xs={12} sx={{ m: 2 }}>
            <KPITitle>{messages.kpi}</KPITitle>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sx={{ px: 2 }}>
            <KpiEmailCampaign />
          </Grid>
        </Grid>
      </KPIContainer>
      <Grid container>
        <Grid item xs={12}>
          <SentEmailCampaigns />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
