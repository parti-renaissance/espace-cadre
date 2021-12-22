import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/system'
import { Grid, Container, Button as MuiButton, Typography } from '@mui/material'
import KpiEmailCampaign from 'components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaignList from 'components/Dashboard/Charts/SentEmailCampaignList/SentEmailCampaignList'
import SendIcon from '@mui/icons-material/Send'
import PageTitle from 'ui/PageTitle'
import paths from 'components/Messagerie/shared/paths'

const Button = styled(MuiButton)`
  color: ${({ theme }) => theme.palette.button.color};
  background: ${({ theme }) => theme.palette.button.background.main};
  height: 35px;
  border-radius: 8px;
  &:hover {
    background: ${({ theme }) => theme.palette.button.background.hover};
  }
  padding: ${({ theme }) => theme.spacing(0.75, 1)};
`

const SendButtonContainer = styled(Grid)(
  ({ theme }) => `
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${theme.spacing(2)};
`
)

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
        <SendButtonContainer item>
          <Button onClick={() => navigate(paths.create)}>
            <SendIcon sx={{ mr: 1 }} />
            {messages.sendEmail}
          </Button>
        </SendButtonContainer>
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
