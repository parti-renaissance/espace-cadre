import { useEffect } from 'react'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks'
import Percentage from 'ui/Percentage'
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle'
import UIContainer from 'ui/Container'

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

const SentEmailCampaignList = () => {
  const classes = useStyles()
  const [emailCampaignReports, setEmailCampaignReports] = useEmailCampaignReportsCache()

  useEffect(() => {
    const getEmailCampaignReports = async () => {
      try {
        if (emailCampaignReports === null) {
          await getMessages(setEmailCampaignReports)
        }
      } catch (error) {
        // TODO snackbar
      }
    }
    getEmailCampaignReports()
  }, [emailCampaignReports, setEmailCampaignReports])

  const noCampaign = !emailCampaignReports || emailCampaignReports.data.length === 0

  if (noCampaign) {
    return (
      <>
        <SentEmailCampaignListTitle />
        <UIContainer rootClasses={classes.noData}>Aucune campagne à afficher</UIContainer>
      </>
    )
  }

  return (
    <>
      <SentEmailCampaignListTitle />
      {emailCampaignReports.data.map(message => {
        const { statistics: stats } = message
        return (
          <Grid container className={classes.bigCard} key={message.id}>
            <Grid container className={classes.titleRow}>
              <Grid item xs={12}>
                <p className={classes.headline}>{message.subject}</p>
              </Grid>
              <Grid item xs={12}>
                <p className={classes.subtitle}>
                  Le {new Date(message.date).toLocaleDateString()}, par {message.author}
                </p>
              </Grid>
            </Grid>
            <Grid container className={classes.cardRow}>
              <Grid item xs={5} sm={3} className={classes.card}>
                <Grid item className={classes.cardItem}>
                  <div className={classes.infoNumber}>{stats?.sent}</div>
                  <div className={classes.text}>Email{stats?.sent > 1 && 's'}</div>
                </Grid>
              </Grid>
              <Grid item xs={5} sm={3} className={classes.card}>
                <Grid item className={classes.cardItem}>
                  <div className={classes.infoNumber}>
                    <Percentage>{stats.openRate}</Percentage>
                    <span className={classes.parentheseInfo}>({stats.opens})</span>
                  </div>
                  <div className={classes.text}>Ouvertures</div>
                </Grid>
              </Grid>
              <Grid item xs={5} sm={3} className={classes.card}>
                <Grid item className={classes.cardItem}>
                  <div className={classes.infoNumber}>
                    <Percentage>{stats.clickRate}</Percentage>
                    <span className={classes.parentheseInfo}>({stats.clicks})</span>
                  </div>
                  <div className={classes.text}>Clics</div>
                </Grid>
              </Grid>
              <Grid item xs={5} sm={3} className={classes.card}>
                <Grid item className={classes.cardItem}>
                  <div className={classes.infoNumber}>
                    <Percentage>{stats.unsubscribeRate}</Percentage>
                    <span className={classes.parentheseInfo}>({stats.unsubscribes})</span>
                  </div>
                  <div className={classes.text}>Désabonnements</div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )
      })}
    </>
  )
}

export default SentEmailCampaignList
