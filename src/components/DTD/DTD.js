import { generatePath, useNavigate } from 'react-router'
import { useState } from 'react'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getDTDCampaignsQuery } from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'
import CampaignGlobalKPI from './Campaign/CampaignGlobalKPI'
import CampaignItem from './Campaign/CampaignItem'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import DTDMap from 'components/DTD/DTDMap'
import { useUserScope } from '../../redux/user/hooks'
import CircleRoundedIcon from '@mui/icons-material/CircleRounded'
import LegendItem from './LegendItem'
import { LayersCodes } from 'components/Map/Layers'

const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.gray400,
  '&.Mui-selected': {
    color: theme.palette.gray800,
  },
}))

const TabLabel = styled(Typography)`
  font-size: 18px;
  font-weight: 400;
`

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
  title: 'Porte à porte',
  legendTitle: 'Ciblage du Porte à porte en cours',
  legendPrefix: 'Sur cette carte, retrouvez les catégories du Porte à porte en cours.',
  legend: [
    {
      title: 'Les bureaux bleus ',
      main1: 'Bureaux où nous pourrions ',
      bold1: 'gagner des voix ',
      main2: 'par rapport à 2017 mais où les électeurs sont encore ',
      bold2: 'très indécis.',
      subtitle: 'Plus le bleu est foncé (5 variations), plus les personnes sont indécises.',
      color: '#21618C',
    },
    {
      title: 'Les bureaux jaunes ',
      main1: 'Bureaux où nous serions ',
      bold1: 'stables ',
      main2: 'par rapport à 2017 mais où les électeurs sont encore ',
      bold2: 'très indécis.',
      subtitle: 'Plus le jaune est foncé (5 variations), plus les personnes sont indécises.',
      color: '#B7950B',
    },
    {
      title: 'Les bureaux verts ',
      main1: 'Bureaux où nous pourrions ',
      bold1: 'perdre des voix ',
      main2: 'par rapport à 2017, mais où les électeurs sont encore ',
      bold2: 'très indécis.',
      subtitle: 'Plus le vert est foncé (5 variations), plus les personnes sont indécises.',
      color: '#1E8449',
    },
  ],
  pink: {
    title: 'Les bureaux roses ',
    main: "Bureaux où le potentiel de voix est le plus élevé (si n'appartenant pas déjà à un autre critère)",
  },
  cartography: 'Cartographie',
  campaigns: 'Campagnes de mon territoire',
  rightVotes: 'Voix de droite',
  leftVotes: 'Voix de gauche',
}
const DTD_LAYER_POINT = LayersCodes.ciblagePapPoint
const DTD_LAYER_LEFT = LayersCodes.ciblagePapLeft
const DTD_LAYER_RIGHT = LayersCodes.ciblagePapRight

const DTD = () => {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const [userScope] = useUserScope()
  const [selectedTab, setSelectedTab] = useState(messages.cartography)

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

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} />
      </Grid>

      <Grid container justifyContent="space-between">
        <CampaignGlobalKPI />
      </Grid>

      <Grid container data-cy="DTD-campaigns-tabs">
        <Tabs
          variant="scrollable"
          value={selectedTab}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
          sx={{ my: 2 }}
        >
          <Tab
            value={messages.cartography}
            label={<TabLabel>{messages.cartography}</TabLabel>}
            disableRipple
            disableFocusRipple
          />
          <Tab
            value={messages.campaigns}
            label={<TabLabel>{messages.campaigns}</TabLabel>}
            disableRipple
            disableFocusRipple
          />
          <Tab
            value={messages.leftVotes}
            label={<TabLabel>{messages.leftVotes}</TabLabel>}
            disableRipple
            disableFocusRipple
          />
          <Tab
            value={messages.rightVotes}
            label={<TabLabel>{messages.rightVotes}</TabLabel>}
            disableRipple
            disableFocusRipple
          />
        </Tabs>
      </Grid>

      {selectedTab === messages.cartography && (
        <Grid container data-cy="DTD-campaigns-map">
          <Legend container>
            <Typography variant="subtitle1" sx={{ mb: 3 }}>
              {messages.legendTitle}
            </Typography>
            <Grid container>
              <Grid item sx={{ mb: 2 }}>
                {messages.legendPrefix}
              </Grid>
              {messages.legend.map((el, i) => (
                <LegendItem
                  key={i}
                  title={el?.title}
                  main1={el?.main1}
                  main2={el?.main2}
                  bold1={el?.bold1}
                  bold2={el?.bold2}
                  subtitle={el?.subtitle}
                  color={el?.color}
                />
              ))}
              <Grid item display="flex" flexDirection="column">
                <Grid item display="flex" alignItems="center">
                  <Typography variant="subtitle1">{messages.pink.title}</Typography>&nbsp;
                  <CircleRoundedIcon sx={{ color: '#FFD1DE' }} />
                </Grid>
                <Typography>{messages.pink.main}</Typography>
              </Grid>
              <Grid item>{messages.legendSuffix}</Grid>
            </Grid>
          </Legend>
          <Grid item xs={12}>
            <DTDMap userZones={userScope.zones} typeOfLayer={DTD_LAYER_POINT} />
            <DTDMap userZones={userScope.zones} typeOfLayer={DTD_LAYER_RIGHT} />
          </Grid>
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
        <Grid container>
          <DTDMap userZones={userScope.zones} typeOfLayer={DTD_LAYER_LEFT} />
        </Grid>
      )}
      {selectedTab === messages.rightVotes && (
        <Grid container>
          <DTDMap userZones={userScope.zones} typeOfLayer={DTD_LAYER_RIGHT} />
        </Grid>
      )}
    </Container>
  )
}

export default DTD
