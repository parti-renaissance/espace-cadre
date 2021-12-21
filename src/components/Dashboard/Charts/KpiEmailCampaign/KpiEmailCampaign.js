import { useState, useEffect } from 'react'
import { styled } from '@mui/system'
import { Grid, Box, Typography } from '@mui/material'
import { apiClientProxy } from 'services/networking/client'
import UILoader from 'ui/Loader'
import { useEmailCampaignCache } from '../../../../redux/dashboard/hooks'
import Percentage from 'ui/Percentage'
import { useUserScope } from '../../../../redux/user/hooks'
import ErrorComponent from 'components/ErrorComponent'
import UIContainer from 'ui/Container'
import pluralize from 'components/shared/pluralize/pluralize'

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
  sent: 'Envoyée',
  opening: 'Ouvertures',
  national: 'au national',
  clicks: 'Clics',
  unsubscribing: 'Désabonnements',
}

function KpiEmailCampaign() {
  const [campaign, setCampaign] = useEmailCampaignCache()
  const [currentScope] = useUserScope()
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    const getEmailCampaign = async () => {
      try {
        if (campaign === null && currentScope) {
          setCampaign(await apiClientProxy.get('/mailCampaign/reportsRatios'))
        }
      } catch (error) {
        setErrorMessage(error)
      }
    }
    getEmailCampaign()
  }, [currentScope, campaign, setCampaign])

  const emailCampaignContent = () => {
    if (campaign !== null) {
      return (
        <Grid container spacing={2}>
          <CardContainer item xs={12} sm={6} lg={3}>
            <UIContainer rootProps={{ sx: { p: 2 } }}>
              <MainInfo component="div">{campaign.local.nbCampagnes}</MainInfo>
              <MainText component="div">{pluralize(campaign.local.nbCampagnes, messages.campaign)}</MainText>
              <SecondaryText component="div">
                {pluralize(campaign.local.nbCampagnes, messages.sent)} en {new Date().getFullYear()}
              </SecondaryText>
            </UIContainer>
          </CardContainer>
          <CardContainer item xs={12} sm={6} lg={3}>
            <UIContainer rootProps={{ sx: { p: 2 } }}>
              <MainInfo component="div">
                <Percentage>{campaign.local.txOuverture}</Percentage>
              </MainInfo>
              <MainText component="div">{messages.opening}</MainText>
              <SecondaryText component="div">
                <Percentage>{campaign.national.txOuverture}</Percentage> {messages.national}
              </SecondaryText>
            </UIContainer>
          </CardContainer>
          <CardContainer item xs={12} sm={6} lg={3}>
            <UIContainer rootProps={{ sx: { p: 2 } }}>
              <MainInfo component="div">
                <Percentage>{campaign.local.txClique}</Percentage>
              </MainInfo>
              <MainText component="div">{messages.clicks}</MainText>
              <SecondaryText component="div">
                <Percentage>{campaign.national.txClique}</Percentage> {messages.national}
              </SecondaryText>
            </UIContainer>
          </CardContainer>
          <CardContainer item xs={12} sm={6} lg={3}>
            <UIContainer rootProps={{ sx: { p: 2 } }}>
              <MainInfo component="div">
                <Percentage>{campaign.local.txDesabonnement}</Percentage>
              </MainInfo>
              <MainText component="div">{messages.unsubscribing}</MainText>
              <SecondaryText component="div">
                <Percentage>{campaign.national.txDesabonnement}</Percentage> {messages.national}
              </SecondaryText>
            </UIContainer>
          </CardContainer>
        </Grid>
      )
    }
    if (errorMessage) {
      return (
        <Grid container>
          <Grid item xs={12}>
            <ErrorComponent errorMessage={errorMessage} />
          </Grid>
        </Grid>
      )
    }
    return (
      <LoaderContainer>
        <UILoader />
      </LoaderContainer>
    )
  }

  return <>{emailCampaignContent()}</>
}

export default KpiEmailCampaign
