import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getDTDGlobalKPIQuery, getDTDCampaignListQuery } from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'
import CampaignGlobalKPI from './Campaign/CampaignGlobalKPI'
import CampaignListItem from './Campaign/CampaignListItem'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'

const Title = styled(Typography)(
  ({ theme }) => `
    margin: ${theme.spacing(1, 0, 2, 1)};
    font-size: 18px;
    font-weight: 400px;
`
)

const messages = {
  title: 'Porte à porte',
  campaigns: 'Campagnes',
}

const DTD = () => {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()

  const { data: globalKPI = {} } = useQueryWithScope('globalKPI', () => getDTDGlobalKPIQuery(), {
    onError: handleError,
  })

  const {
    data: paginatedCampaignList = null,
    fetchNextPage: fetchNexPageCampaignList,
    hasNextPage: hasNextPageCampaignList,
  } = useInfiniteQueryWithScope('campaignList', pageParams => getDTDCampaignListQuery(pageParams), {
    getNextPageParam,
    onError: handleError,
  })
  const campaignList = usePaginatedData(paginatedCampaignList)

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
          <CampaignGlobalKPI campaigns={globalKPI.campaigns} surveys={globalKPI.surveys} doors={globalKPI.calls} />
        )}
      </Grid>

      <Grid container justifyContent="space-between" sx={{ pt: 4 }}>
        <Grid container>
          <Title data-testid="Campaigns-list-title">{messages.campaigns}</Title>
        </Grid>

        {campaignList.length > 0 && (
          <InfiniteScroll
            dataLength={history.length}
            next={() => fetchNexPageCampaignList()}
            hasMore={hasNextPageCampaignList}
            loader={<Loader />}
          >
            <Grid container spacing={2}>
              {campaignList.map(campaign => (
                <CampaignListItem
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
          </InfiniteScroll>
        )}
      </Grid>
    </Container>
  )
}

export default DTD
