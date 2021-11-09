import { Container, Grid } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import createStyles from '@mui/styles/createStyles'
import ActiveUsers from './Charts/ActiveUsers/ActiveUsers'
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount'
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign'
import MapComponent from './Map/MapComponent'
import TextChart from './Charts/TextChart/TextChart'
import smartphone from 'assets/smartphone.svg'

const useStyles = makeStyles(theme =>
  createStyles({
    mainContainer: {
      marginBottom: theme.spacing(2),
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      margin: theme.spacing(0, 0, 2, 1),
      color: theme.palette.grayCorner3,
    },
    phoneImg: {
      verticalAlign: 'middle',
      marginRight: theme.spacing(1),
    },
    kpiContainer: {
      marginBottom: theme.spacing(1),
    },
  })
)

const Dashboard = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="lg" className={classes.mainContainer}>
      <Grid container>
        <TextChart />
        <KpiEmailCampaign />
        <Grid item xs={12}>
          <p className={classes.title}>
            <img src={smartphone} alt="smartphone-logo" className={classes.phoneImg} />
            <span>Application mobile</span>
          </p>
        </Grid>
        <Grid container spacing={2} className={classes.kpiContainer}>
          <Grid item xs={12} lg={6}>
            <Grid item className="with-background dc-container">
              <DownloadsCount />
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Grid item className="with-background dc-container">
              <ActiveUsers />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className="with-background dc-container">
          <MapComponent />
        </Grid>
      </Grid>
    </Container>
  )
}
export default Dashboard
