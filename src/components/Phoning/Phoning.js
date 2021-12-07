import { Container, Grid, Paper, Card, CardContent, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useQuery } from 'react-query'
import { getGlobalKpiQuery, getPhoningCampaignsQuery } from 'api/phoning'
import pluralize from 'components/shared/pluralize/pluralize'
import UICard from 'ui/Card'
import UIChip from 'ui/Card/Chip/Chip'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import PhoningRatioProgress from './shared/PhoningRatioProgress'

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

const DateTypography = styled(Typography)(
  ({ theme }) => `
  font-size: 10px;
  font-weight: 400;
  color: ${theme.palette.gray600}
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
  campaigns: 'Campagnes',
  over: 'Terminé',
  ongoing: 'En cours',
}

const Phoning = () => {
  const handleNewCampaign = () => {}
  const { handleError } = useErrorHandler()

  const { data: globalKpi = [] } = useQuery('globalKpi', getGlobalKpiQuery, { onError: handleError })
  const { data: campaigns = [] } = useQuery('campaigns', getPhoningCampaignsQuery, { onError: handleError })

  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          message={messages.actionButtonText}
          handleAction={handleNewCampaign}
          actionButtonProps={{
            sx: {
              color: 'phoning.background.main',
              bgcolor: 'phoning.background.hover',
              '&:hover': {
                bgcolor: 'phoning.background.hover',
              },
            },
          }}
        />
      </Grid>
      <Paper sx={{ p: 2, my: 2, background: '#E5E7EB', borderRadius: '12px' }}>
        <Grid container>
          <Title>{messages.kpiContainerTitle}</Title>
        </Grid>
        <Grid container spacing={2}>
          <CardWrapper lg={2.4} xl={2.4}>
            <Card sx={{ borderRadius: '8.35px' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Kpi>{globalKpi.campaignCount}</Kpi>
                <KpiTitle>{pluralize(globalKpi.campaignCount, messages.campaign)}</KpiTitle>
                <SecondaryKpi>
                  {messages.ongoingCampaignsPrefix} {globalKpi.ongoingCampaigns} {messages.ongoingCampaignsSuffix}
                </SecondaryKpi>
              </CardContent>
            </Card>
          </CardWrapper>
          <CardWrapper lg={2.4} xl={2.4}>
            <Card sx={{ borderRadius: '8.35px' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Kpi>{globalKpi.surveysCount}</Kpi>
                <KpiTitle>{pluralize(globalKpi.surveysCount, messages.survey)}</KpiTitle>
                <SecondaryKpi>
                  {globalKpi.lastMonthSurveysCount} {messages.lastMonth}
                </SecondaryKpi>
              </CardContent>
            </Card>
          </CardWrapper>
          <CardWrapper lg={2.4} xl={2.4}>
            <Card sx={{ borderRadius: '8.35px' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Kpi>{globalKpi.callsCount}</Kpi>
                <KpiTitle>{pluralize(globalKpi.callsCount, messages.call)}</KpiTitle>
                <SecondaryKpi>
                  {globalKpi.lastMonthCallsCount} {messages.lastMonth}
                </SecondaryKpi>
              </CardContent>
            </Card>
          </CardWrapper>
        </Grid>
      </Paper>

      <Grid container>
        <Title>{messages.campaigns}</Title>
      </Grid>
      <Grid container spacing={2}>
        {campaigns.map(({ id, endTime, title, creator, teamName, teamMembersCount, goal, callsCount }) => (
          <Grid item key={id} lg={3} xl={3} sx={{ flexGrow: 1 }}>
            <UICard
              rootProps={{ sx: { borderRadius: '8.35px' } }}
              headerTitle={
                <>
                  <Grid container sx={{ my: 1 }}>
                    <Grid item sx={{ mx: 1 }}>
                      {endTime ? (
                        <UIChip label={messages.over} color="#374151" backgroundColor="rgba(55, 65, 81, 0.08)" />
                      ) : (
                        <UIChip label={messages.ongoing} color="#047857" backgroundColor="rgba(4, 120, 87, 0.08)" />
                      )}
                    </Grid>
                    <Grid item>
                      <DateTypography>{format(new Date(endTime), 'dd MMMM yyyy', { locale: fr })}</DateTypography>
                    </Grid>
                  </Grid>
                  <Grid container flexDirection="column">
                    <Typography variant="subtitle1">{title}</Typography>
                    <Typography variant="subtitle2">{`${creator} • ${teamName}(${teamMembersCount})`}</Typography>
                  </Grid>
                </>
              }
              content={<PhoningRatioProgress count={callsCount} totalCount={goal} />}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Phoning
