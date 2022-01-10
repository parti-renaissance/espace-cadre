import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { getDTDGlobalKPIQuery, getDTDCampaignListQuery } from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'
import DTDGlobalKPI from './DTDGlobalKPI'
import DTDCampaignList from './DTDCampaignList'
import PageHeader from 'ui/PageHeader'
import { useQueryWithScope } from 'api/useQueryWithScope'

const Title = styled(Typography)(
  ({ theme }) => `
    margin: ${theme.spacing(1, 0, 2, 1)};
    font-size: 18px;
    font-weight: 400px;
`
)

const messages = {
  title: 'Porte à porte',
  create: 'Créer une campagne',
  campaigns: 'Campagnes',
  over: 'Terminé',
  ongoing: 'En cours',
  see: 'Voir',
}

const DTD = () => {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()

  const { data: globalKPI = {} } = useQueryWithScope('globalKPI', () => getDTDGlobalKPIQuery(), {
    onError: handleError,
  })
  const { data: campaigns = [] } = useQueryWithScope('campaigns', () => getDTDCampaignListQuery(), {
    onError: handleError,
  })

  const handleView = campaignId => () => {
    navigate(generatePath('/porte-a-porte/:campaignId', { campaignId }))
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} />
      </Grid>

      <Grid container justifyContent="space-between">
        {Object.keys(globalKPI).length > 0 && (
          <DTDGlobalKPI campaigns={globalKPI.campaigns} surveys={globalKPI.surveys} doors={globalKPI.calls} />
        )}
      </Grid>

      <Grid container justifyContent="space-between" sx={{ pt: 4 }}>
        <Grid container>
          <Title data-testid="Campaigns-list-title">{messages.campaigns}</Title>
        </Grid>

        {campaigns.length > 0 && (
          <Grid container spacing={2}>
            {campaigns.map(campaign => (
              <DTDCampaignList
                key={campaign.id}
                endDate={campaign.endDate}
                title={campaign.title}
                author={campaign.author}
                team={campaign.team}
                score={campaign.score}
                handleView={handleView(campaign.id)}
              />
            ))}
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default DTD
