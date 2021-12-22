import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'
import { Grid, Container, Typography } from '@mui/material'
import KpiEmailCampaign from 'components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaignList from 'components/Dashboard/Charts/SentEmailCampaignList/SentEmailCampaignList'
import SendIcon from '@mui/icons-material/Send'
import PageTitle from 'ui/PageTitle'
import paths from 'components/Messagerie/shared/paths'
import MainButton from 'ui/MainButton/MainButton'

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
        <PageTitle title={messages.title} />
        <MainButton onClick={() => navigate(paths.create)}>
          <SendIcon sx={{ mr: 1 }} />
          {messages.sendEmail}
        </MainButton>
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
          <SentEmailCampaignList />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
