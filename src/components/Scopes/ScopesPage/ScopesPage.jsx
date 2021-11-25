import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Grid, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { getCurrentUser, getUserScopes } from '../../../redux/user/selectors'
import { useUserScope } from '../../../redux/user/hooks'
import barChartScopes from 'assets/bar-chart-scopes.svg'
import paths from 'shared/paths'

const useStyles = makeStyles(theme => ({
  pageContainer: {
    height: '400px',
    backgroundColor: theme.palette.blue2Corner,
  },
  siteInfoContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(13.5),
    marginBottom: theme.spacing(1.5),
  },
  logo: {
    marginRight: theme.spacing(0.5),
    width: '30px',
    height: '45px',

    [theme.breakpoints.up('md')]: {
      width: '48px',
      marginTop: theme.spacing(1.5),
    },
  },
  title: {
    color: theme.palette.whiteCorner,
    fontSize: '30px',
    fontWeight: 600,

    [theme.breakpoints.up('md')]: {
      fontSize: '48px',
    },
  },
  beta: {
    color: theme.palette.whiteCorner,
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: theme.palette.blackCorner,
    padding: theme.spacing(0.25, 0.5, 0),
    margin: theme.spacing(0.75, 0, 3.25, 0.75),
    borderRadius: '4px',

    [theme.breakpoints.up('md')]: {
      fontSize: '16px',
      height: '26px',
      padding: theme.spacing(0.25, 1, 0),
      marginLeft: theme.spacing(1.25),
    },
  },
  mainCard: {
    margin: theme.spacing(0, 'auto', 10.5),
    padding: theme.spacing(2),
    border: '1px solid #D5E0EC',
    maxWidth: '250px',
    borderRadius: '6px',
  },
  mainCardTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: theme.palette.whiteCorner,
    margin: 0,
    padding: 0,
  },
  mainCardRole: {
    fontSize: '10px',
    fontWeight: 400,
    color: theme.palette.whiteCorner,
    padding: 0,
  },
  cardsContainer: {
    padding: theme.spacing(2),
  },
  secondaryCard: {
    height: '142px',
    maxWidth: '282px',
    backgroundColor: theme.palette.whiteCorner,
    cursor: 'pointer',
    borderRadius: '8.35px',
    [theme.breakpoints.down('lg')]: {
      marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(2),
    },
  },
  role: {
    fontSize: '28px',
    fontWeight: 600,
    color: theme.palette.blue2Corner,
  },
  zone: {
    fontSize: '16px',
    fontWeight: 600,
    color: theme.palette.blackCorner,
  },
}))

const messages = {
  title: "Je m'engage",
}

function ScopesPage() {
  const classes = useStyles()
  const userScopes = useSelector(getUserScopes)
  const currentUser = useSelector(getCurrentUser)
  const [, updateCurrentScope] = useUserScope()
  const filteredScopes = userScopes.filter(scope => scope.apps.includes('data_corner'))

  const scopeContent = scope => {
    if (scope?.zones?.length === 1) {
      return (
        <Box className={classes.zone}>
          {scope.zones[0].name} ({scope.zones[0].code})
        </Box>
      )
    }
    if (scope?.zones?.length > 1) {
      return (
        <Box className={classes.zone}>
          {`${scope.zones[0].name} (${scope.zones[0].code})`} + {scope.zones.slice(1).length} zone
          {scope.zones.slice(1).length > 1 && 's'}
        </Box>
      )
    }
    return null
  }

  return (
    <Container maxWidth={false} className={classes.pageContainer}>
      <Grid container className={classes.siteInfoContainer}>
        <img src={barChartScopes} alt="Logo data corner" className={classes.logo} />
        <span className={classes.title}>{messages.title}</span>
        <span className={classes.beta}>BÊTA</span>
      </Grid>
      <Grid container className={classes.mainCard}>
        <Grid item xs={12}>
          <Box className={classes.mainCardTitle}>
            {currentUser?.firstName} {currentUser?.lastName}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className={classes.mainCardRole}>{filteredScopes?.length} rôles</Box>
        </Grid>
      </Grid>
      {filteredScopes?.length > 0 && (
        <Grid container className={classes.cardsContainer} spacing={2} justifyContent="center">
          {filteredScopes.map(userScope => {
            const to = userScope.code === 'phoning_national_manager' ? paths.teams : paths.dashboard
            return (
              <Grid item xs={12} sm={5} className={classes.secondaryCard} key={userScope.code}>
                <Link to={to} value={userScope.code} onClick={() => updateCurrentScope(userScope)}>
                  <Box className={classes.role}>{userScope.name}</Box>
                  {scopeContent(userScope)}
                </Link>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Container>
  )
}

export default ScopesPage
