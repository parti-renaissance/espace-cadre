import { useState, useEffect } from 'react'
import { Grid, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { apiClientProxy } from 'services/networking/client'
import Loader from 'ui/Loader'
import { useEmailCampaignCache } from '../../../../redux/dashboard/hooks'
import Percentage from 'ui/Percentage'
import { useUserScope } from '../../../../redux/user/hooks'
import EmailCampaignTitle from './EmailCampaignTitle'
import ErrorComponent from '../../../ErrorComponent/ErrorComponent'
import UIContainer from 'ui/Container'

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
                <Box className={classes.mainText}>Campagne{campaign.local.nbCampagnes > 1 && 's'}</Box>
                <Box className={classes.secondaryText}>
                  Envoyée{campaign.local.nbCampagnes > 1 && 's'} en {new Date().getFullYear()}
                </Box>
              </UIContainer>
            </Grid>
            <Grid item xs={12} sm={6} lg={3} className={classes.cardContainer}>
              <UIContainer rootClasses={classes.littleCard}>
                <Box className={classes.mainInfo}>
                  <Percentage>{campaign.local.txOuverture}</Percentage>
                </Box>
                <Box className={classes.mainText}>Ouvertures</Box>
                <Box className={classes.secondaryText}>
                  <Percentage>{campaign.national.txOuverture}</Percentage> au national
                </Box>
              </UIContainer>
            </Grid>
            <Grid item xs={12} sm={6} lg={3} className={classes.cardContainer}>
              <UIContainer rootClasses={classes.littleCard}>
                <Box className={classes.mainInfo}>
                  <Percentage>{campaign.local.txClique}</Percentage>
                </Box>
                <Box className={classes.mainText}>Clics</Box>
                <Box className={classes.secondaryText}>
                  <Percentage>{campaign.national.txClique}</Percentage> au national
                </Box>
              </UIContainer>
            </Grid>
            <Grid item xs={12} sm={6} lg={3} className={classes.cardContainer}>
              <UIContainer rootClasses={classes.littleCard}>
                <Box className={classes.mainInfo}>
                  <Percentage>{campaign.local.txDesabonnement}</Percentage>
                </Box>
                <Box className={classes.mainText}>Désabonnements</Box>
                <Box className={classes.secondaryText}>
                  <Percentage>{campaign.national.txDesabonnement}</Percentage> au national
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
        <UIContainer breakpoints={{ xs: 12 }} textAlign="center">
          <Loader />
        </UIContainer>
      </>
    )
  }

  return <>{emailCampaignContent()}</>
}

export default KpiEmailCampaign
