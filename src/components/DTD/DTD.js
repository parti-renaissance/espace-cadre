import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'

import { getDTDGlobalKPIQuery, getDTDCampaignListQuery, getDTDCampaignQuery } from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'
import DTDGlobalKPI from './DTDGlobalKPI'
import DTDCampaign from './DTDCampaign'
import CreateEdit from './CreateEdit/CreateEdit'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
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
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [campaignIdToUpdate, setCampaignIdToUpdate] = useState()
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()

  const { data: globalKPI = {} } = useQueryWithScope('globalKPI', () => getDTDGlobalKPIQuery(), {
    onError: handleError,
  })
  const { data: campaigns = [], refetch: refetchCampaigns } = useQueryWithScope(
    'campaigns',
    () => getDTDCampaignListQuery(),
    { onError: handleError }
  )
  const { data: campaign = {} } = useQueryWithScope(
    ['campaign', campaignIdToUpdate],
    () => getDTDCampaignQuery(campaignIdToUpdate),
    {
      enabled: !!campaignIdToUpdate,
      onSuccess: () => {
        setIsCreateEditModalOpen(true)
      },
      onError: handleError,
    }
  )

  const handleView = campaignId => () => {
    navigate(generatePath('/porte-a-porte/:campaignId', { campaignId }))
  }

  const handleUpdate = campaignId => () => {
    setCampaignIdToUpdate(campaignId)
  }

  const handleClose = () => {
    setCampaignIdToUpdate(undefined)
    setIsCreateEditModalOpen(false)
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton onClick={() => setIsCreateEditModalOpen(true)} label={messages.create} />}
        />
      </Grid>

      <Grid container justifyContent="space-between">
        {Object.keys(globalKPI).length > 0 && (
          <DTDGlobalKPI campaigns={globalKPI.campaigns} surveys={globalKPI.surveys} calls={globalKPI.calls} />
        )}
      </Grid>

      <Grid container justifyContent="space-between" sx={{ pt: 4 }}>
        <Grid container>
          <Title data-testid="Campaigns-list-title">{messages.campaigns}</Title>
        </Grid>

        {campaigns.length > 0 && (
          <Grid container spacing={2}>
            {campaigns.map(campaign => (
              <DTDCampaign
                key={campaign.id}
                endDate={campaign.endDate}
                title={campaign.title}
                author={campaign.author}
                team={campaign.team}
                score={campaign.score}
                handleView={handleView(campaign.id)}
                handleUpdate={handleUpdate(campaign.id)}
              />
            ))}
          </Grid>
        )}
      </Grid>

      <CreateEdit
        campaign={Object.keys(campaign).length > 0 ? campaign : null}
        isOpen={isCreateEditModalOpen}
        onCreateResolve={refetchCampaigns}
        handleClose={handleClose}
      />
    </Container>
  )
}

export default DTD
