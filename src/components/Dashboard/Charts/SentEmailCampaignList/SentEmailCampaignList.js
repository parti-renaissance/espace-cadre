import { useState, useEffect } from 'react'
import { Grid, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { apiClientProxy } from 'services/networking/client'
import Loader from 'ui/Loader'
import { useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks'
import Percentage from 'ui/Percentage'
import ErrorComponent from 'components/ErrorComponent'
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle'
import UIContainer from 'ui/Container'
import { pluralize } from 'components/shared/pluralize'

const useStyles = makeStyles(theme => ({
  bigCard: {
    marginBottom: theme.spacing(2),
    background: theme.palette.whiteCorner,
    borderRadius: '6px',
    boxShadow: '0 1px 1px 0 rgba(0, 0, 0, .04)',
  },
  titleRow: {
    padding: theme.spacing(0, 2),
  },
  headline: {
    color: theme.palette.blackCorner,
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: 0,
  },
  subtitle: {
    color: theme.palette.grayCorner3,
    fontSize: '12px',
    fontWeight: '400',
    margin: 0,
  },
  cardRow: {
    padding: theme.spacing(2),
  },
  card: {
    '&:not(:last-child)': {
      paddingRight: theme.spacing(1),
    },
  },
  cardItem: {
    padding: theme.spacing(2, 2, 2, 0),
    borderRadius: '6px',
    [theme.breakpoints.up('sm')]: {
      border: `solid 1px ${theme.palette.grayCornerBg}`,
      paddingLeft: theme.spacing(2),
    },
  },
  infoNumber: {
    color: theme.palette.blueCorner,
    fontSize: '16px',
    fontWeight: 600,
  },
  parentheseInfo: {
    fontWeight: 400,
    color: theme.palette.grayCorner3,
    marginLeft: theme.spacing(0.25),
  },
  text: {
    fontSize: '12px',
    fontWeight: '400',
    color: theme.palette.grayCorner3,
  },
  noData: {
    textAlign: 'center',
    padding: theme.spacing(0.75),
  },
}))

const messages = {
  email: 'Email',
  opening: 'Ouvertures',
  clicks: 'Clics',
  unsubscribing: 'Désabonnements',
  noCampaign: 'Aucune campagne à afficher',
}

function SentEmailCampaignList() {
  const classes = useStyles()
  const [emailCampaignReports, setEmailCampaignReports] = useEmailCampaignReportsCache()
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    const getEmailCampaignReports = async () => {
      try {
        if (emailCampaignReports === null) {
          setEmailCampaignReports(await apiClientProxy.get('/mailCampaign/reports'))
        }
      } catch (error) {
        setErrorMessage(error)
      }
    }
    getEmailCampaignReports()
  }, [emailCampaignReports, setEmailCampaignReports])

  const emailCampaignsContent = () => {
    const campaignsExist = emailCampaignReports && emailCampaignReports.map(item => item.campagnes.length > 0)
    const noCampaign = emailCampaignReports && emailCampaignReports.map(item => item.campagnes.length === 0)

    if (emailCampaignReports !== null && campaignsExist.some(val => val)) {
      return (
        <>
          <SentEmailCampaignListTitle />
          {emailCampaignReports.map(report =>
            report.campagnes.map((campagne, index) => (
              <Grid container className={classes.bigCard} key={index}>
                <Grid container className={classes.titleRow}>
                  <Grid item xs={12}>
                    <p className={classes.headline}>{campagne.titre}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <p className={classes.subtitle}>
                      Le {new Date(campagne.date).toLocaleDateString()}, par {campagne.auteur}
                    </p>
                  </Grid>
                </Grid>
                <Grid container className={classes.cardRow}>
                  <Grid item xs={5} sm={3} className={classes.card}>
                    <Grid item className={classes.cardItem}>
                      <div className={classes.infoNumber}>{campagne.nbEmails}</div>
                      <div className={classes.text}>{pluralize(campagne.nbEmails, messages.mail)}</div>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} sm={3} className={classes.card}>
                    <Grid item className={classes.cardItem}>
                      <div className={classes.infoNumber}>
                        <Percentage>{campagne.txOuverture}</Percentage>
                        <span className={classes.parentheseInfo}>({campagne.nbOuvertures})</span>
                      </div>
                      <div className={classes.text}>{messages.opening}</div>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} sm={3} className={classes.card}>
                    <Grid item className={classes.cardItem}>
                      <div className={classes.infoNumber}>
                        <Percentage>{campagne.txClique}</Percentage>
                        <span className={classes.parentheseInfo}>({campagne.nbCliques})</span>
                      </div>
                      <div className={classes.text}>{messages.clicks}</div>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} sm={3} className={classes.card}>
                    <Grid item className={classes.cardItem}>
                      <div className={classes.infoNumber}>
                        <Percentage>{campagne.txDesabonnement}</Percentage>
                        <span className={classes.parentheseInfo}>({campagne.nbDesabonnements})</span>
                      </div>
                      <div className={classes.text}>{messages.unsubscribing}</div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))
          )}
        </>
      )
    }
    if (emailCampaignReports !== null && noCampaign.every(val => val)) {
      return (
        <>
          <SentEmailCampaignListTitle />
          <UIContainer rootClasses={classes.noData}>{messages.noCampaign}</UIContainer>
        </>
      )
    }
    if (errorMessage) {
      return (
        <Box>
          <ErrorComponent errorMessage={errorMessage} />
        </Box>
      )
    }
    return (
      <UIContainer breakpoints={{ xs: 12 }} textAlign="center">
        <Loader />
      </UIContainer>
    )
  }
  return <>{emailCampaignsContent()}</>
}

export default SentEmailCampaignList
