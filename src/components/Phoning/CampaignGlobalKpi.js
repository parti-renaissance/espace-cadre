import { Grid, Card, CardContent, Typography } from '@mui/material'
import pluralize from 'components/shared/pluralize/pluralize'
import { styled } from '@mui/system'
import { GlobalKpi as DomainGlobalKpi } from 'domain/phoning'

const CardWrapper = styled(props => <Grid item {...props} />)`
  flex-grow: 1;
`

const Kpi = styled(Typography)(
  ({ theme }) => `
      color: ${theme.palette.indigo700};
      font-size: 28px;
      font-weight: 600px;
  `
)

const KpiTitle = styled(Typography)(
  ({ theme }) => `
      color: ${theme.palette.gray900};
      font-size: 16px;
      font-weight: 600px;
  `
)

const SecondaryKpi = styled(Typography)(
  ({ theme }) => `
      color: ${theme.palette.gray600};
      font-size: 12px;
      font-weight: 400px;
  `
)

const messages = {
  campaign: 'Campagne',
  ongoingCampaignsPrefix: 'Dont',
  ongoingCampaignsSuffix: 'en cours',
  survey: 'Questionnaire',
  lastMonth: 'sur un mois',
  call: 'Appel',
}

const CampaignGlobalKpi = ({ globalKpi }) => {
  const { campaignCount, ongoingCampaigns, surveysCount, lastMonthSurveysCount, callsCount, lastMonthCallsCount } =
    globalKpi
  return (
    <Grid container spacing={2}>
      <CardWrapper lg={2.4} xl={2.4}>
        <Card sx={{ borderRadius: '8.35px' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <Kpi>{campaignCount}</Kpi>
            <KpiTitle>{pluralize(campaignCount, messages.campaign)}</KpiTitle>
            <SecondaryKpi>
              {messages.ongoingCampaignsPrefix} {ongoingCampaigns} {messages.ongoingCampaignsSuffix}
            </SecondaryKpi>
          </CardContent>
        </Card>
      </CardWrapper>
      <CardWrapper lg={2.4} xl={2.4}>
        <Card sx={{ borderRadius: '8.35px' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <Kpi>{surveysCount}</Kpi>
            <KpiTitle>{pluralize(surveysCount, messages.survey)}</KpiTitle>
            <SecondaryKpi>
              {lastMonthSurveysCount} {messages.lastMonth}
            </SecondaryKpi>
          </CardContent>
        </Card>
      </CardWrapper>
      <CardWrapper lg={2.4} xl={2.4}>
        <Card sx={{ borderRadius: '8.35px' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <Kpi>{callsCount}</Kpi>
            <KpiTitle>{pluralize(callsCount, messages.call)}</KpiTitle>
            <SecondaryKpi>
              {lastMonthCallsCount} {messages.lastMonth}
            </SecondaryKpi>
          </CardContent>
        </Card>
      </CardWrapper>
    </Grid>
  )
}

export default CampaignGlobalKpi

CampaignGlobalKpi.propTypes = {
  globalKpi: DomainGlobalKpi.propTypes,
}
