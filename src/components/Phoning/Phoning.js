import { Container, Grid, Paper, Card, CardContent, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useQuery } from 'react-query'
import { getGlobalKpiQuery } from 'api/phoning'
import pluralize from 'components/shared/pluralize/pluralize'

const CardWrapper = styled(props => <Grid item {...props} />)`
  flex-grow: 1;
`

const Title = styled(Typography)(
  ({ theme }) => `
	margin: ${theme.spacing(1, 0, 2, 1)};
	font-size: 18px;
	font-weight: 400px;
`
)

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
  title: 'Phoning',
  actionButtonText: 'Créer une campagne',
  kpiContainerTitle: 'Indicateurs',
  campaign: 'Campagne',
  survey: 'Questionnaire',
  call: 'Appel',
  lastMonth: 'sur un mois',
  ongoingCampaignsPrefix: 'Dont',
  ongoingCampaignsSuffix: 'en cours',
}

const Phoning = () => {
  const handleNewCampaign = () => {}
  const { handleError } = useErrorHandler()

  const { data: globalKpi = [] } = useQuery('globalKpi', () => getGlobalKpiQuery(), { onError: handleError })

  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          message={messages.actionButtonText}
          parentStyles={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.08)' }}
          handleAction={handleNewCampaign}
        />
      </Grid>
      <Paper sx={{ p: 2, background: '#E5E7EB', borderRadius: '12px' }}>
        <Grid container>
          <Title>{messages.kpiContainerTitle}</Title>
        </Grid>
        <Grid container spacing={2}>
          <CardWrapper lg={2.4} xl={2.4}>
            <Card>
              <CardContent>
                <Kpi>{globalKpi.campaignCount}</Kpi>
                <br />
                <KpiTitle>{pluralize(globalKpi.campaignCount, messages.campaign)}</KpiTitle>
                <br />
                <SecondaryKpi>
                  {messages.ongoingCampaignsPrefix} {globalKpi.ongoingCampaigns} {messages.ongoingCampaignsSuffix}
                </SecondaryKpi>
              </CardContent>
            </Card>
          </CardWrapper>
          <CardWrapper lg={2.4} xl={2.4}>
            <Card>
              <CardContent>
                <Kpi>{globalKpi.surveysCount}</Kpi>
                <br />
                <KpiTitle>{pluralize(globalKpi.surveysCount, messages.survey)}</KpiTitle>
                <br />
                <SecondaryKpi>
                  {globalKpi.lastMonthSurveysCount} {messages.lastMonth}
                </SecondaryKpi>
              </CardContent>
            </Card>
          </CardWrapper>
          <CardWrapper lg={2.4} xl={2.4}>
            <Card>
              <CardContent>
                <Kpi>{globalKpi.callsCount}</Kpi>
                <br />
                <KpiTitle>{pluralize(globalKpi.callsCount, messages.call)}</KpiTitle>
                <br />
                <SecondaryKpi>
                  {globalKpi.lastMonthCallsCount} {messages.lastMonth}
                </SecondaryKpi>
              </CardContent>
            </Card>
          </CardWrapper>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Phoning
