import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Grid, Box } from '@material-ui/core'
import { getCurrentUser, getUserScopes } from '../../../redux/user/selectors'
import { useUserScope } from '../../../redux/user/hooks'
import PATHS from '../../../paths'
import barChartScopes from 'assets/bar-chart-scopes.svg'

function ScopesPage() {
  const userScopes = useSelector(getUserScopes)
  const currentUser = useSelector(getCurrentUser)
  const [, updateCurrentScope] = useUserScope()
  const filteredScopes = userScopes.filter(scope => scope.apps.includes('data_corner'))

  const scopeContent = scope => {
    if (scope?.zones?.length === 1) {
      return (
        <Box className="zone">
          {scope.zones[0].name} ({scope.zones[0].code})
        </Box>
      )
    }
    if (scope?.zones?.length > 1) {
      return (
        <Box className="zone">
          {`${scope.zones[0].name} (${scope.zones[0].code})`} + {scope.zones.slice(1).length} zone
          {scope.zones.slice(1).length > 1 && 's'}
        </Box>
      )
    }
    return null
  }

  return (
    <Container maxWidth="xl" className="scopes-page-container">
      <Grid container className="logo-title-container">
        <img src={barChartScopes} alt="Logo data corner" className="page-logo" />
        <span className="page-title">DataCorner</span>
        <span className="beta">BÊTA</span>
      </Grid>
      <Grid container className="main-scope-card">
        <Grid item xs={12}>
          <Box className="main-card-title">
            {currentUser?.firstName} {currentUser?.lastName}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box className="main-card-role">{filteredScopes?.length} rôles</Box>
        </Grid>
      </Grid>
      {filteredScopes?.length > 0 && (
        <Grid container className="secondary-scope-card-container">
          {filteredScopes.map((userScope, index) => {
            const to = userScope.code === 'phoning_national_manager' ? PATHS.TEAMS.route : PATHS.DASHBOARD.route
            return (
              <Link
                className="secondary-card"
                to={to}
                key={index + 1}
                value={userScope.code}
                onClick={() => updateCurrentScope(userScope)}
              >
                <Box className="role">{userScope.name}</Box>
                {scopeContent(userScope)}
              </Link>
            )
          })}
        </Grid>
      )}
    </Container>
  )
}

export default ScopesPage
