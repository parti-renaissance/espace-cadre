import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'
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

const Title = styled(Typography)(
  ({ theme }) => `
    margin: ${theme.spacing(1, 0, 2, 1)};
    font-size: 18px;
    font-weight: 400px;
`
)

const Legend = styled(Grid)(
  ({ theme }) => `
  padding: 16px;
  margin-bottom: ${theme.spacing(2)};
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
  campaigns: 'Campagnes',
  legendTitle: 'Ciblage du Porte à porte en cours',
  legendPrefix: 'Sur cette carte, retrouvez les catégories du Porte à porte en cours.',
  blue: {
    title: 'Les bureaux bleus 🔵',
    main1: 'Bureaux où nous pourrions ',
    bold1: 'gagner des voix ',
    main2: 'par rapport à 2017 mais où les électeurs sont encore ',
    bold2: 'très indécis.',
    subtitle: 'Plus le bleu est foncé (5 variations), plus les personnes sont indécises.',
  },
  yellow: {
    title: 'Les bureaux jaunes 🟡',
    main1: 'Bureaux où nous serions ',
    bold1: 'stables ',
    main2: 'par rapport à 2017 mais où les électeurs sont encore ',
    bold2: 'très indécis.',
    subtitle: 'Plus le jaune est foncé (5 variations), plus les personnes sont indécises.',
  },
  green: {
    title: 'Les bureaux verts 🟢',
    main1: 'Bureaux où nous pourrions ',
    bold1: 'perdre des voix ',
    main2: 'par rapport à 2017, mais où les électeurs sont encore ',
    bold2: 'très indécis.',
    subtitle: 'Plus le vert est foncé (5 variations), plus les personnes sont indécises.',
  },
  violet: {
    title: 'Les bureaux violets 🟣',
    main: "Bureaux où le potentiel de voix est le plus élevé (si n'appartenant pas déjà à un autre critère)",
  },
}

const DTD = () => {
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const [userScope] = useUserScope()

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
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} />
      </Grid>

      <Grid container justifyContent="space-between">
        <CampaignGlobalKPI />
      </Grid>

      <Legend container>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {messages.legendTitle}
        </Typography>
        <Grid container>
          <Grid item sx={{ mb: 1 }}>
            {messages.legendPrefix}
          </Grid>
          <Grid item display="flex" flexDirection="column" sx={{ mb: 1 }}>
            <Typography variant="subtitle1">{messages.blue.title}</Typography>
            <Typography>
              {messages.blue.main1}
              <Typography sx={{ fontWeight: 600 }}>{messages.blue.bold1}</Typography>
              {messages.blue.main2}
              <Typography sx={{ fontWeight: 600 }}>{messages.blue.bold2}</Typography>
            </Typography>
            <Typography sx={{ fontStyle: 'italic' }}>{messages.blue.subtitle}</Typography>
          </Grid>
          <Grid item display="flex" flexDirection="column" sx={{ mb: 1 }}>
            <Typography variant="subtitle1">{messages.yellow.title}</Typography>
            <Typography>
              {messages.yellow.main1}
              <Typography sx={{ fontWeight: 600 }}>{messages.yellow.bold1}</Typography>
              {messages.yellow.main2}
              <Typography sx={{ fontWeight: 600 }}>{messages.yellow.bold2}</Typography>
            </Typography>
            <Typography sx={{ fontStyle: 'italic' }}>{messages.yellow.subtitle}</Typography>
          </Grid>
          <Grid item display="flex" flexDirection="column" sx={{ mb: 1 }}>
            <Typography variant="subtitle1">{messages.green.title}</Typography>
            <Typography>
              {messages.green.main1}
              <Typography sx={{ fontWeight: 600 }}>{messages.green.bold1}</Typography>
              {messages.green.main2}
              <Typography sx={{ fontWeight: 600 }}>{messages.green.bold2}</Typography>
            </Typography>
            <Typography sx={{ fontStyle: 'italic' }}>{messages.green.subtitle}</Typography>
          </Grid>
          <Grid item display="flex" flexDirection="column">
            <Typography variant="subtitle1">{messages.violet.title}</Typography>
            <Typography>{messages.violet.main}</Typography>
          </Grid>
          <Grid item>{messages.legendSuffix}</Grid>
        </Grid>
      </Legend>

      <DTDMap userZones={userScope.zones} />

      <Grid
        container
        justifyContent="space-between"
        data-cy="DTD-campaigns-container"
        sx={{ pt: 4, ...infiniteScrollStylesOverrides }}
      >
        <Grid container>
          <Title data-testid="Campaigns-title">{messages.campaigns}</Title>
        </Grid>

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
    </Container>
  )
}

export default DTD
