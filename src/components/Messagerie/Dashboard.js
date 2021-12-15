import { useNavigate } from 'react-router-dom'
import { Grid, Container, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import KpiEmailCampaign from 'components/Dashboard/Charts/KpiEmailCampaign'
import SentEmailCampaignList from 'components/Dashboard/Charts/SentEmailCampaignList/SentEmailCampaignList'
import SendIcon from '@mui/icons-material/Send'
import PageTitle from 'ui/PageTitle'
import paths from 'components/Messagerie/shared/paths'

const useStyles = makeStyles(theme => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.whiteCorner,
    },
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
    backgroundColor: theme.palette.gray200,
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
  sendEmail: 'Envoyer un email',
  kpi: 'Indicateurs',
}

const Dashboard = () => {
  const classes = useStyles()
  const navigate = useNavigate()

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageTitle title={messages.title} />
        <Grid
          item
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 2,
          }}
        >
          <Button
            sx={{ color: '#2834C3', bgcolor: '#2718E514', '&:hover': { bgcolor: '#2718E514' }, px: 1, py: 0.75 }}
            onClick={() => navigate(paths.create)}
          >
            <SendIcon sx={{ mr: 1 }} />
            {messages.sendEmail}
          </Button>
        </Grid>
      </Grid>
      <Grid container className={classes.messagerieKpi}>
        <Grid container>
          <Grid item xs={12} className={classes.kpiTitle}>
            {messages.kpi}
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
