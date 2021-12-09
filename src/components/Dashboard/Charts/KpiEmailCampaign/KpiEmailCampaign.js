import { useState, useEffect } from 'react'
import { Grid, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { apiClientProxy } from 'services/networking/client'
import UILoader from 'ui/Loader'
import { useEmailCampaignCache } from '../../../../redux/dashboard/hooks'
import Percentage from 'ui/Percentage'
import { useUserScope } from '../../../../redux/user/hooks'
import EmailCampaignTitle from './EmailCampaignTitle'
import ErrorComponent from 'components/ErrorComponent'
import UIContainer from 'ui/Container'
import pluralize from 'components/shared/pluralize/pluralize'
import { styled } from '@mui/system'

const useStyles = makeStyles(theme => ({
  cardContainer: {
    '&:last-child': {
      marginBottom: theme.spacing(2),
    },
  },
  littleCard: {
    padding: theme.spacing(2),
  },
  mainInfo: {
    fontSize: '40px',
    fontWeight: '600',
    textAlign: 'left',
    color: theme.palette.blueCorner,
  },
  mainText: {
    fontSize: '16px',
    fontWeight: '600',
    color: theme.palette.blackCorner,
  },
  secondaryText: {
    fontSize: '12px',
    fontWeight: '400',
    color: theme.palette.grayCorner3,
  },
}))

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
  const classes = useStyles()
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
        <>
          <EmailCampaignTitle />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3} className={classes.cardContainer}>
              <UIContainer rootClasses={classes.littleCard}>
                <Box className={classes.mainInfo}>{campaign.local.nbCampagnes}</Box>
                <Box className={classes.mainText}>{pluralize(campaign.local.nbCampagnes, messages.campaign)}</Box>
                <Box className={classes.secondaryText}>
                  {pluralize(campaign.local.nbCampagnes, messages.sent)} en {new Date().getFullYear()}
                </Box>
              </UIContainer>
            </Grid>
            <Grid item xs={12} sm={6} lg={3} className={classes.cardContainer}>
              <UIContainer rootClasses={classes.littleCard}>
                <Box className={classes.mainInfo}>
                  <Percentage>{campaign.local.txOuverture}</Percentage>
                </Box>
                <Box className={classes.mainText}>{messages.opening}</Box>
                <Box className={classes.secondaryText}>
                  <Percentage>{campaign.national.txOuverture}</Percentage> {messages.national}
                </Box>
              </UIContainer>
            </Grid>
            <Grid item xs={12} sm={6} lg={3} className={classes.cardContainer}>
              <UIContainer rootClasses={classes.littleCard}>
                <Box className={classes.mainInfo}>
                  <Percentage>{campaign.local.txClique}</Percentage>
                </Box>
                <Box className={classes.mainText}>{messages.clicks}</Box>
                <Box className={classes.secondaryText}>
                  <Percentage>{campaign.national.txClique}</Percentage> {messages.national}
                </Box>
              </UIContainer>
            </Grid>
            <Grid item xs={12} sm={6} lg={3} className={classes.cardContainer}>
              <UIContainer rootClasses={classes.littleCard}>
                <Box className={classes.mainInfo}>
                  <Percentage>{campaign.local.txDesabonnement}</Percentage>
                </Box>
                <Box className={classes.mainText}>{messages.unsubscribing}</Box>
                <Box className={classes.secondaryText}>
                  <Percentage>{campaign.national.txDesabonnement}</Percentage> {messages.national}
                </Box>
              </UIContainer>
            </Grid>
          </Grid>
        </>
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
      <>
        <EmailCampaignTitle />
        <LoaderContainer>
          <UILoader />
        </LoaderContainer>
      </>
    )
  }

  return <>{emailCampaignContent()}</>
}

export default KpiEmailCampaign
