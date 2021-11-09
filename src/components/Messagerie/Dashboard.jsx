import { Link } from 'react-router-dom'
import { Grid, Container, Button } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import KpiEmailCampaign from 'components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaignList from 'components/Dashboard/Charts/SentEmailCampaignList/SentEmailCampaignList'
import PATHS from '../../paths'
import arrowRight from 'assets/arrow-right.svg'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      '&:hover': {
        backgroundColor: theme.palette.whiteCorner,
      },
    },
    pageTitle: {
      fontSize: '32px',
      fontWeight: '600',
    },
    mailButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    buttonLink: {
      marginTop: theme.spacing(0.75),
    },
    messagerieMailButton: {
      fontSize: '14px',
      fontWeight: '600',
      color: theme.palette.blue2Corner,
      backgroundColor: theme.palette.whiteCorner,
      marginBottom: theme.spacing(1.25),
      padding: theme.spacing(0.5, 2),
      border: 'none',
      borderRadius: '79px',
      textTransform: 'none',
    },
    messagerieKpi: {
      backgroundColor: 'rgba(19, 92, 235, 0.05)',
      marginBottom: theme.spacing(2),
      borderRadius: theme.spacing(0.75),
    },
    kpiTitle: {
      color: theme.palette.blackCorner,
      fontSize: '20px',
      fontWeight: '600',
      margin: theme.spacing(2),
    },
    kpiComponent: {
      padding: theme.spacing(0, 4),
    },
  })
)

const Dashboard = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <Grid item>
          <span className={classes.pageTitle}>Messagerie</span>
        </Grid>
        <Grid item className={classes.mailButtonContainer}>
          <Link to={PATHS.MESSAGERIE_CREATE.route} className={classes.buttonLink}>
            <Button
              type="button"
              disableRipple
              className={classes.messagerieMailButton}
              classes={{ root: classes.root }}
              endIcon={<img src={arrowRight} alt="right arrow" />}
            >
              Envoyer un email
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid container className={classes.messagerieKpi}>
        <Grid container>
          <Grid item xs={12} className={classes.kpiTitle}>
            En quelques chiffres
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} className={classes.kpiComponent}>
            <KpiEmailCampaign />
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <SentEmailCampaignList />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard
