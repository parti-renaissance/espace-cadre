import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useQuery } from 'react-query'
import { getPhoningGlobalKPIQuery, getPhoningCampaignListQuery } from 'api/phoning'
import PhoningGlobalKPI from './GlobalKPI'
import PhoningCampaign from './Campaign'
import { generatePath, useNavigate } from 'react-router'

const Title = styled(Typography)(
  ({ theme }) => `
    margin: ${theme.spacing(1, 0, 2, 1)};
    font-size: 18px;
    font-weight: 400px;
`
)

const messages = {
  title: 'Phoning',
  create: 'Créer une campagne',
  campaigns: 'Campagnes',
  over: 'Terminé',
  ongoing: 'En cours',
  see: 'Voir',
}

const Phoning = () => {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const { data: globalKPI = {} } = useQuery('globalKPI', () => getPhoningGlobalKPIQuery(), { onError: handleError })
  const { data: campaigns = [] } = useQuery('campaigns', () => getPhoningCampaignListQuery(), { onError: handleError })

  const handleClick = campaignId => () => {
    navigate(generatePath('/phoning/:campaignId', { campaignId }))
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          message={messages.create}
          handleAction={() => {}}
          actionButtonProps={{
            sx: {
              color: 'phoning.color',
              bgcolor: 'phoning.background.main',
              '&:hover': {
                bgcolor: 'phoning.background.hover',
              },
            },
          }}
        />
      </Grid>

      <Grid container justifyContent="space-between">
        {Object.keys(globalKPI).length > 0 && (
          <PhoningGlobalKPI campaigns={globalKPI.campaigns} surveys={globalKPI.surveys} calls={globalKPI.calls} />
        )}
      </Grid>

      <Grid container justifyContent="space-between" sx={{ pt: 4 }}>
        <Grid container>
          <Title>{messages.campaigns}</Title>
        </Grid>

        {campaigns.length > 0 && (
          <Grid container spacing={2}>
            {campaigns.map(campaign => (
              <PhoningCampaign
                key={campaign.id}
                endDate={campaign.endDate}
                title={campaign.title}
                author={campaign.author}
                team={campaign.team}
                score={campaign.score}
                handleClick={handleClick(campaign.id)}
              />
            ))}
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default Phoning
