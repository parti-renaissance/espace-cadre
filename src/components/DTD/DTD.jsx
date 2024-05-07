import { generatePath, useNavigate } from 'react-router'
import { useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { getDTDCampaignsQuery } from '~/api/DTD'
import { useErrorHandler } from '~/components/shared/error/hooks'
import CampaignGlobalKPI from './Campaign/CampaignGlobalKPI'
import CampaignItem from './Campaign/CampaignItem'
import Loader from '~/ui/Loader'
import PageHeader from '~/ui/PageHeader'
import DTDMap from '~/components/DTD/DTDMap'
import { useUserScope } from '~/redux/user/hooks'
import { LayersCodes } from '~/components/Map/Layers'
import DTDAddressMap from '~/components/DTD/DTDAddressMap'

const Legend = styled(Grid)(
  ({ theme }) => `
  padding: 16px;
  margin-bottom: ${theme.spacing(1)};
  border-radius: 12px;
  background: ${theme.palette.whiteCorner};
`
)

const infiniteScrollStylesOverrides = {
  '& .infinite-scroll-component__outerdiv': {
    width: '100%',
  },
}

const messages = {
  title: 'Micro-ciblage',
  address_map: 'Micro-ciblage',
  campaigns: 'Campagnes de mon territoire',
  rightVotes: 'Réserve à droite',
  leftVotes: 'Réserve à gauche',
  abstainingVotes: "Réserve d'abstentionnistes",
  leftTitle: "Convaincre l'électorat de gauche de voter pour notre candidat",
  leftMain: 'Plus la couleur est sombre, plus la réserve de voix de gauche est intéressante',
  rightTitle: "S'assurer du report de voix de la droite",
  rightMain: 'Plus la couleur est sombre, plus la réserve de voix de droite (hors Le Pen) est intéressante',
  absTitle: 'Inciter les abstentionnistes à voter',
  absMain: "Plus la couleur est sombre, plus le bassin d'abstentionnistes déçus du premier tour est intéressant",
}
const DTD_LAYER_LEFT = LayersCodes.ciblagePapLeft
const DTD_LAYER_RIGHT = LayersCodes.ciblagePapRight
const DTD_LAYER_ABSTAINING = LayersCodes.ciblagePapAbstaining

const DTD = () => {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const [userScope] = useUserScope()
  const [selectedTab] = useState(messages.address_map)

  const {
    data: paginatedCampaigns = null,
    fetchNextPage: fetchNextPageCampaigns,
    hasNextPage: hasNextPageCampaigns,
  } = useInfiniteQueryWithScope(
    ['paginated-campaigns', { feature: 'DTD', view: 'DTD' }],
    pageParams => getDTDCampaignsQuery(pageParams),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const campaigns = usePaginatedData(paginatedCampaigns)

  const handleView = campaignId => () => {
    navigate(generatePath('/porte-a-porte/:campaignId', { campaignId }))
  }

  return (
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} />
      </Grid>
      <Grid container justifyContent="space-between">
        {selectedTab !== messages.address_map && <CampaignGlobalKPI />}
      </Grid>
      {selectedTab === messages.address_map && (
        <Grid item xs={12}>
          <DTDAddressMap userZones={userScope.zones} typeOfLayer={DTD_LAYER_LEFT} />
        </Grid>
      )}
      {selectedTab === messages.campaigns && (
        <Grid container justifyContent="space-between" sx={{ ...infiniteScrollStylesOverrides }}>
          {campaigns.length > 0 && (
            <InfiniteScroll
              dataLength={campaigns.length}
              next={() => fetchNextPageCampaigns()}
              hasMore={hasNextPageCampaigns}
              loader={<Loader />}
            >
              <Grid container spacing={2} data-cy="DTD-campaigns-list">
                {campaigns.map(campaign => (
                  <CampaignItem
                    key={campaign.id}
                    startDate={campaign.startDate}
                    endDate={campaign.endDate}
                    title={campaign.title}
                    author={campaign.author}
                    team={campaign.team}
                    score={campaign.score}
                    handleView={handleView(campaign.id)}
                  />
                ))}
              </Grid>
            </InfiniteScroll>
          )}
        </Grid>
      )}
      {selectedTab === messages.leftVotes && (
        <Grid item xs={12}>
          <Legend container>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 3 }}>
                {messages.leftTitle}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontSize: '15px' }}>
                {messages.leftMain}
              </Typography>
            </Grid>
          </Legend>
          <DTDMap userZones={userScope.zones} typeOfLayer={DTD_LAYER_LEFT} />
        </Grid>
      )}
      {selectedTab === messages.rightVotes && (
        <Grid item xs={12}>
          <Legend container>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{messages.rightTitle}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontSize: '15px' }}>
                {messages.rightMain}
              </Typography>
            </Grid>
          </Legend>
          <DTDMap userZones={userScope.zones} typeOfLayer={DTD_LAYER_RIGHT} />
        </Grid>
      )}
      {selectedTab === messages.abstainingVotes && (
        <Grid item xs={12}>
          <Legend container>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 3 }}>
                {messages.absTitle}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontSize: '15px' }}>
                {messages.absMain}
              </Typography>
            </Grid>
          </Legend>
          <DTDMap userZones={userScope.zones} typeOfLayer={DTD_LAYER_ABSTAINING} />
        </Grid>
      )}
    </Container>
  )
}

export default DTD
