import { Container as MuiContainer, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import ActiveUsers from './Charts/ActiveUsers/ActiveUsers'
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount'
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign'
import MapComponent from './Map/MapComponent'
import TextChart from './Charts/TextChart/TextChart'
import UIContainer from 'ui/Container'
import PageTitle from 'ui/PageTitle'
import PhoneIcon from 'ui/icons/PhoneIcon'
import { useUserScope } from '../../redux/user/hooks'
import EmptyContent from 'ui/EmptyContent'

const Container = styled(MuiContainer)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const Title = styled(props => <Typography component="p" {...props} />)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  margin: ${theme.spacing(0, 0, 2, 1)};
  color: ${theme.palette.grayCorner3};
`
)

const KPIContainer = styled(Grid)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const messages = {
  title: "Vue d'ensemble",
  mobile: 'Application mobile',
  upcoming: 'Bientôt en ligne',
  description: 'Cette page sera bientôt disponible sur notre site !',
}

const upcomingFeatureScopes = ['phoning_national_manager', 'pap_national_manager']

const Dashboard = () => {
  const [currentScope] = useUserScope()

  if (upcomingFeatureScopes.includes(currentScope.code))
    return <EmptyContent title={messages.upcoming} description={messages.description} />

  return (
    <Container maxWidth="lg">
      <Grid container>
        <PageTitle title={messages.title} breakpoints={{ xs: 12 }} />
        <TextChart />
        <KpiEmailCampaign />
        <Grid item xs={12}>
          <Title>
            <PhoneIcon titleAccess="smartphone-logo" />
            <span>{messages.mobile}</span>
          </Title>
        </Grid>
        <KPIContainer container spacing={2}>
          <Grid item xs={12} lg={6}>
            <UIContainer>
              <DownloadsCount />
            </UIContainer>
          </Grid>
          <Grid item xs={12} lg={6}>
            <UIContainer>
              <ActiveUsers />
            </UIContainer>
          </Grid>
        </KPIContainer>
        <Grid item xs={12}>
          <UIContainer>
            <MapComponent />
          </UIContainer>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
