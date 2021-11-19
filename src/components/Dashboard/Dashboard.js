import { Container, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'
import ActiveUsers from './Charts/ActiveUsers/ActiveUsers'
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount'
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign'
import MapComponent from './Map/MapComponent'
import TextChart from './Charts/TextChart/TextChart'
import smartphone from 'assets/smartphone.svg'
import UIContainer from 'ui/UIContainer'
import PageTitle from 'ui/PageTitle'

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

const messages = {
  title: "Vue d'ensemble",
  mobile: 'Application mobile',
}

const Dashboard = () => {
  const classes = useStyles()

  return (
    <Container maxWidth="lg" className={classes.mainContainer}>
      <Grid container>
        <PageTitle title={messages.title} breakpoints={{ xs: 12 }} />
        <TextChart />
        <KpiEmailCampaign />
        <Grid item xs={12}>
          <p className={classes.title}>
            <img src={smartphone} alt="smartphone-logo" className={classes.phoneImg} />
            <span>{messages.mobile}</span>
          </p>
        </Grid>
        <Grid container spacing={2} className={classes.kpiContainer}>
          <Grid item xs={12} lg={6}>
            <UIContainer>
              <DownloadsCount />
            </UIContainer>
          </Grid>
          <Grid item xs={12} lg={6}>
            <UIContainer>
              <ActiveUsers />
            </UIContainer>
          </Grid>
        </Grid>
        <UIContainer breakpoints={{ xs: 12 }}>
          <MapComponent />
        </UIContainer>
      </Grid>
    </Container>
  )
}
export default Dashboard
