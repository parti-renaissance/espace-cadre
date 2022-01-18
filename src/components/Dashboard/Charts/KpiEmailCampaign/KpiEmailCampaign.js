import { styled } from '@mui/system'
import { Grid, Typography } from '@mui/material'
import UILoader from 'ui/Loader'
import Percentage from 'ui/Percentage'
import UIContainer from 'ui/Container'
import pluralize from 'components/shared/pluralize/pluralize'
import { reportsRatio } from 'api/messagerie'
import ErrorComponent from 'components/ErrorComponent'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { DASHBOARD_CACHE_DURATION } from 'components/Dashboard/shared/cache'

const CardContainer = styled(Grid)`
  &:last-child {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`

const MainInfo = styled(Typography)`
  font-size: 40px;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.palette.blueCorner};
`

const MainText = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blackCorner};
`

const SecondaryText = styled(Typography)`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.grayCorner3};
`

const LoaderContainer = styled(props => <Grid item xs={12} {...props} />)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.whiteCorner};
  border-radius: 6px;
  height: 120px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const messages = {
  campaign: 'Campagne',
  email: "d'e-mails",
  sent: 'Envoyée',
  sentSuffix: 'ces 30 derniers jours',
  opening: 'Ouvertures',
  national: 'au national',
  clicks: 'Clics',
  unsubscribing: 'Désabonnements',
  errorLoading: 'Impossible de récupérer les données',
}

const KpiEmailCampaign = () => {
  const {
    data: campaignsReportRatios = null,
    isLoading,
    isError,
  } = useQueryWithScope('reportsRatio', reportsRatio, {
    cacheTime: DASHBOARD_CACHE_DURATION,
    staleTime: DASHBOARD_CACHE_DURATION,
  })

  if (isLoading) {
    return (
      <LoaderContainer>
        <UILoader />
      </LoaderContainer>
    )
  }
  if (isError) {
    return (
      <LoaderContainer>
        <ErrorComponent errorMessage={{ message: messages.errorLoading }} />
      </LoaderContainer>
    )
  }

  return (
    <Grid container spacing={2}>
      <CardContainer item xs={12} sm={6} lg={3}>
        <UIContainer rootProps={{ sx: { p: 2 } }}>
          <MainInfo component="div">{campaignsReportRatios.local.campaignsCount}</MainInfo>
          <MainText component="div">
            {pluralize(campaignsReportRatios.local.campaignsCount, messages.campaign)}&nbsp;{messages.email}
          </MainText>
          <SecondaryText component="div">
            {pluralize(campaignsReportRatios.local.campaignsCount, messages.sent)}&nbsp;
            {messages.sentSuffix}
          </SecondaryText>
        </UIContainer>
      </CardContainer>
      <CardContainer item xs={12} sm={6} lg={3}>
        <UIContainer rootProps={{ sx: { p: 2 } }}>
          <MainInfo component="div">
            <Percentage>{campaignsReportRatios.local.openRate}</Percentage>
          </MainInfo>
          <MainText component="div">{messages.opening}</MainText>
          <SecondaryText component="div">
            <Percentage>{campaignsReportRatios.national.openRate}</Percentage> {messages.national}
          </SecondaryText>
        </UIContainer>
      </CardContainer>
      <CardContainer item xs={12} sm={6} lg={3}>
        <UIContainer rootProps={{ sx: { p: 2 } }}>
          <MainInfo component="div">
            <Percentage>{campaignsReportRatios.local.clickRate}</Percentage>
          </MainInfo>
          <MainText component="div">{messages.clicks}</MainText>
          <SecondaryText component="div">
            <Percentage>{campaignsReportRatios.national.clickRate}</Percentage> {messages.national}
          </SecondaryText>
        </UIContainer>
      </CardContainer>
      <CardContainer item xs={12} sm={6} lg={3}>
        <UIContainer rootProps={{ sx: { p: 2 } }}>
          <MainInfo component="div">
            <Percentage>{campaignsReportRatios.local.unsubscribeRate}</Percentage>
          </MainInfo>
          <MainText component="div">{messages.unsubscribing}</MainText>
          <SecondaryText component="div">
            <Percentage>{campaignsReportRatios.national.unsubscribeRate}</Percentage> {messages.national}
          </SecondaryText>
        </UIContainer>
      </CardContainer>
    </Grid>
  )
}

export default KpiEmailCampaign
