import { useSelector } from 'react-redux'
import { styled } from '@mui/system'
import { Link } from 'react-router-dom'
import { Container as MuiContainer, Grid, Typography } from '@mui/material'
import { getCurrentUser, getUserScopes } from '../../../redux/user/selectors'
import { useUserScope } from '../../../redux/user/hooks'
import paths from 'shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'
import barChartScopes from 'assets/barChartScopes.svg'

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

const BarChartLogo = styled('img')`
  margin-right: ${({ theme }) => theme.spacing(0.5)};
  width: 30px;
  height: 45px;

  ${props => props.theme.breakpoints.up('md')} {
    width: 48px;
    margin-top: ${({ theme }) => theme.spacing(1.5)};
  },
`

const Title = styled(Typography)`
  color: ${({ theme }) => theme.palette.whiteCorner};
  font-size: 30px;
  font-weight: 600;

  ${props => props.theme.breakpoints.up('md')} {
    font-size: 48px;
  },
`

const Beta = styled('span')`
  color: ${({ theme }) => theme.palette.whiteCorner};
  font-size: 10px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.palette.blackCorner};
  padding: ${({ theme }) => theme.spacing(0.25, 0.5, 0)};
  margin: ${({ theme }) => theme.spacing(0.75, 0, 3.25, 0.75)};
  border-radius: 4px;

  ${props => props.theme.breakpoints.up('md')} {
    font-size: 16px;
    height: 26px;
    padding: ${({ theme }) => theme.spacing(0.25, 1, 0)};
    margin-left: ${({ theme }) => theme.spacing(1.25)};
  },
`

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

const ScopeCard = styled(Grid)`
  height: 142px;
  max-width: 282px;
  background: ${({ theme }) => theme.palette.whiteCorner};
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  ${props => props.theme.breakpoints.up('sm')} {
    margin-right: ${({ theme }) => theme.spacing(2)};
  }
`

const Role = styled(Typography)`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.palette.blue2Corner};
`

const messages = {
  title: "Je m'engage",
  beta: 'BÊTA',
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
      <BrandContainer container>
        <BarChartLogo src={barChartScopes} alt="Logo data corner" />
        <Title>{messages.title}</Title>
        <Beta>{messages.beta}</Beta>
      </BrandContainer>
      <UserCardContainer container>
        <UserCardTitle>
          {currentUser?.firstName} {currentUser?.lastName}
        </UserCardTitle>
        <UserCardRole>
          {filteredScopes?.length} {messages.roles}
        </UserCardRole>
      </UserCardContainer>
      {filteredScopes?.length > 0 && (
        <Grid container sx={{ p: 2 }} spacing={2} justifyContent="center">
          {filteredScopes.map(userScope => {
            const to = userScope.code === 'phoning_national_manager' ? paths.teams : paths.dashboard
            return (
              <ScopeCard item xs={12} md={3} lg={2} key={userScope.code}>
                <Link to={to} value={userScope.code} onClick={() => updateCurrentScope(userScope)}>
                  <Role>{userScope.name}</Role>
                  {userScope?.zones?.length === 1 && (
                    <Typography component="div" variant="subtitle1">
                      {userScope.zones[0].name} ({userScope.zones[0].code})
                    </Typography>
                  )}
                  {userScope?.zones?.length > 1 && (
                    <Typography component="div" variant="subtitle1">
                      {`${userScope.zones[0].name} (${userScope.zones[0].code})`} + {userScope.zones.slice(1).length}
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
