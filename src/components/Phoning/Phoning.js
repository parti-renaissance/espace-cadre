import { Container, Paper, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useQuery } from 'react-query'
import { getGlobalKpiQuery, getPhoningCampaignsQuery } from 'api/phoning'
import UICard from 'ui/Card'
import { Chip } from 'ui/Card/'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import PhoningRatioProgress from './shared/PhoningRatioProgress'
import CampaignGlobalKpi from './CampaignGlobalKpi'

const DateTypography = styled(Typography)(
  ({ theme }) => `
  font-size: 10px;
  font-weight: 400;
  color: ${theme.palette.gray600}
`
)

const Title = styled(Typography)(
  ({ theme }) => `
      margin: ${theme.spacing(1, 0, 2, 1)};
      font-size: 18px;
      font-weight: 400px;
  `
)

const messages = {
  title: 'Phoning',
  actionButtonText: 'Créer une campagne',
  kpiContainerTitle: 'Indicateurs',
  campaigns: 'Campagnes',
  over: 'Terminé',
  ongoing: 'En cours',
}

const Phoning = () => {
  const handleNewCampaign = () => {}
  const { handleError } = useErrorHandler()

  const { data: globalKpi = {} } = useQuery('globalKpi', getGlobalKpiQuery, { onError: handleError })
  const { data: campaigns = [] } = useQuery('campaigns', getPhoningCampaignsQuery, { onError: handleError })

  return (
    <Container maxWidth="lg">
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
        {Object.keys(globalKpi).length > 0 && <CampaignGlobalKpi globalKpi={globalKpi} />}
      </Paper>

      <Grid container>
        <Title>{messages.campaigns}</Title>
      </Grid>
      <Grid container spacing={2}>
        {campaigns.map(({ id, endTime, title, creator, teamName, teamMembersCount, goal, callsCount }) => (
          <Grid item key={id} item xs={12} sm={6} md={3} lg={3} xl={3}>
            <UICard
              rootProps={{ sx: { borderRadius: '8.35px' } }}
              headerTitle={
                <>
                  <Grid container sx={{ my: 1 }}>
                    <Grid item sx={{ mx: 1 }}>
                      {endTime ? (
                        <Chip label={messages.over} color="#374151" bgcolor="rgba(55, 65, 81, 0.08)" />
                      ) : (
                        <Chip label={messages.ongoing} color="#047857" bgcolor="rgba(4, 120, 87, 0.08)" />
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
