import { lazy, Suspense, useEffect } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from './redux/user/selectors'
import PATHS from './paths'
import { CircularProgress, Grid } from '@mui/material'

const Dashboard = lazy(() => import('./components/Dashboard'))
const Adherents = lazy(() => import('./components/Adherents'))
const MessagerieDashboard = lazy(() => import('./components/Messagerie'))
const MessageTemplate = lazy(() => import('./components/Messagerie/Template'))
const MessageFilter = lazy(() => import('./components/Messagerie/Filters'))
const MessageConfirmation = lazy(() => import('./components/Messagerie/Confirmation'))
const Elections = lazy(() => import('./components/Elections/Elections'))
const Ripostes = lazy(() => import('./components/Ripostes'))
const Teams = lazy(() => import('./components/Teams'))
const TeamEdit = lazy(() => import('./components/Teams/TeamEdit'))
const NoMatch = lazy(() => import('./components/NoMatch'))

export const MENU = [PATHS.DASHBOARD, PATHS.ADHERENTS, PATHS.MESSAGERIE, PATHS.ELECTIONS, PATHS.RIPOSTES, PATHS.TEAMS]

const COMPONENTS = [
  {
    path: PATHS.DASHBOARD,
    component: Dashboard,
  },
  {
    path: PATHS.ADHERENTS,
    component: Adherents,
  },
  {
    path: PATHS.MESSAGERIE,
    component: MessagerieDashboard,
  },
  {
    path: PATHS.MESSAGERIE_CREATE,
    component: MessageTemplate,
  },
  {
    path: PATHS.MESSAGERIE_EDIT,
    component: MessageTemplate,
  },
  {
    path: PATHS.MESSAGERIE_FILTER,
    component: MessageFilter,
  },
  {
    path: PATHS.MESSAGERIE_CONFIRMATION,
    component: MessageConfirmation,
  },
  {
    path: PATHS.ELECTIONS,
    component: Elections,
  },
  {
    path: PATHS.RIPOSTES,
    component: Ripostes,
  },
  {
    path: PATHS.TEAMS,
    component: Teams,
  },
  {
    path: PATHS.TEAMS_EDIT,
    component: TeamEdit,
  },
]

const Routes = () => {
  const history = useHistory()
  const authorizedPage = useSelector(getAuthorizedPages)
  const routes = []

  useEffect(() => {
    history.listen((_, action) => {
      if (action === 'PUSH') {
        window.scrollTo(0, 0)
      }
    })
  }, [history])

  if (authorizedPage && authorizedPage.length > 0) {
    COMPONENTS.forEach((component, index) => {
      if (authorizedPage.includes(component.path?.id)) {
        routes.push(<Route key={index + 1} path={component.path.route} exact component={component.component} />)
      }
    })
    routes.push(<Route key={-2} component={NoMatch} />)
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>{routes}</Switch>
    </Suspense>
  )
}

export default Routes

const Spinner = () => (
  <Grid container style={{ marginTop: 'calc(100vh - 70vh)', textAlign: 'center' }}>
    <Grid item xs={12}>
      <CircularProgress style={{ color: '#0049C6' }} />
    </Grid>
    <Grid item xs={12}>
      <strong>Page en cours de chargement</strong>
    </Grid>
  </Grid>
)
