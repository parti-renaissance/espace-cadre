import { Link } from 'react-router-dom'
import { Grid, Container, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import KpiEmailCampaign from 'components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaignList from 'components/Dashboard/Charts/SentEmailCampaignList/SentEmailCampaignList'
import arrowRight from 'assets/arrow-right.svg'
import PageTitle from 'ui/PageTitle'

const useStyles = makeStyles(theme => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.whiteCorner,
    },
  },
  mailButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  messagerieMailButton: {
    fontSize: '14px',
    fontWeight: '600',
    color: theme.palette.blue2Corner,
    backgroundColor: theme.palette.whiteCorner,
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
}))

const messages = {
  title: 'Messagerie',
}

const Dashboard = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageTitle title={messages.title} />
        <Grid item className={classes.mailButtonContainer}>
          <Link to="creer">
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
