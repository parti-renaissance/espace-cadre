import { useSelector } from 'react-redux'
import { styled } from '@mui/system'
import { Link } from 'react-router-dom'
import { Container as MuiContainer, Grid, Typography } from '@mui/material'
import { getCurrentUser, getUserScopes } from '../../../redux/user/selectors'
import { useUserScope } from '../../../redux/user/hooks'
import paths from 'shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'
import BarChartIcon from 'ui/icons/BarChartIcon'
import scopes from 'shared/scopes'

const Container = styled(MuiContainer)`
  height: 400px;
  background: ${({ theme }) => theme.palette.blue2Corner};
`

const BrandContainer = styled(Grid)(
  ({ theme }) => `
  display: flex;
  justify-content: center;
  padding-top: ${theme.spacing(13.5)};
  margin-bottom: ${theme.spacing(1.5)};
`
)

const UIBarChartIcon = styled(BarChartIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  fontSize: '40px',
  [theme.breakpoints.down('md')]: {
    fontSize: '27px',
  },
}))

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.whiteCorner,
  fontSize: '30px',
  fontWeight: 600,

  [theme.breakpoints.up('md')]: {
    fontSize: '48px',
  },
}))

const UserCardContainer = styled(Grid)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  margin: ${theme.spacing(0, 'auto', 10.5)};
  padding: ${theme.spacing(2)};
  border: 1px solid ${theme.palette.whiteCorner};
  max-width: 250px;
  border-radius: 6px;
`
)

const UserCardTitle = styled(props => <Typography variant="body2" {...props} />)`
  color: ${({ theme }) => theme.palette.whiteCorner};
  margin: 0;
  padding: 0;
`

const UserCardRole = styled(Typography)`
  font-size: 10px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.whiteCorner};
  padding: 0;
`

const ScopeCard = styled(Grid)(({ theme }) => ({
  height: '142px',
  maxWidth: '282px',
  background: theme.palette.whiteCorner,
  cursor: 'pointer',
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    marginRight: theme.spacing(2),
  },
}))

const Role = styled(Typography)`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blue2Corner};
`

const messages = {
  title: "Je m'engage",
  roles: 'rôles',
  zone: 'zone',
}

function ScopesPage() {
  const userScopes = useSelector(getUserScopes)
  const currentUser = useSelector(getCurrentUser)
  const [, updateCurrentScope] = useUserScope()
  const filteredScopes = userScopes.filter(scope => scope.apps.includes('data_corner'))

  return (
    <Container maxWidth={false}>
      <BrandContainer container alignItems="center">
        <UIBarChartIcon fontSize="large" titleAccess="Logo data corner" />
        <Title>{messages.title}</Title>
      </BrandContainer>
      <UserCardContainer container>
        <UserCardTitle>
          {currentUser?.firstName} {currentUser?.lastName}
        </UserCardTitle>
        <UserCardRole>
          {filteredScopes?.length}&nbsp;{messages.roles}
        </UserCardRole>
      </UserCardContainer>
      {filteredScopes?.length > 0 && (
        <Grid container sx={{ p: 2 }} spacing={2} justifyContent="center">
          {filteredScopes.map(userScope => {
            const to = userScope.code === scopes.phoning_national_manager ? paths.team : paths.dashboard
            return (
              <ScopeCard item xs={12} md={3} lg={2} key={userScope.code}>
                <Link to={to} value={userScope.code} onClick={() => updateCurrentScope(userScope.code)}>
                  <Role>{userScope.name}</Role>
                  {userScope?.zones?.length === 1 && (
                    <Typography component="div" variant="subtitle1">
                      {userScope.zones[0].name} ({userScope.zones[0].code})
                    </Typography>
                  )}
                  {userScope?.zones?.length > 1 && (
                    <Typography component="div" variant="subtitle1">
                      {`${userScope.zones[0].name} (${userScope.zones[0].code})`} + {userScope.zones.slice(1).length}
                      &nbsp;
                      {pluralize(userScope.zones.slice(1).length, messages.zone)}
                    </Typography>
                  )}
                </Link>
              </ScopeCard>
            )
          })}
        </Grid>
      )}
    </Container>
  )
}

export default ScopesPage
