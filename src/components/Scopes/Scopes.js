import { styled } from '@mui/system'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Grid, Button as MuiButton, Menu, MenuItem as MuiMenuItem, Divider, Typography } from '@mui/material'
import { getCurrentUser, getUserScopes } from '../../redux/user/selectors'
import { useUserScope } from '../../redux/user/hooks'
import vector from 'assets/vector.svg'
import paths from 'shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'

const Button = styled(MuiButton)(
  ({ theme }) => `
  display: flex;
  justify-content: space-between;
  text-transform: capitalize;
  color: ${theme.palette.menu.color.main};
  background: ${theme.palette.menu.background.hover};
  padding: ${theme.spacing(0.75, 2)};
  border-radius: 6px;
  margin: ${theme.spacing(0, 2, 3)};
  width: 243px;
`
)

const MenuItem = styled(MuiMenuItem)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${theme.palette.menu.color.main};
  border-radius: 6px;
  padding: ${theme.spacing(1, 2)};
  margin-bottom: ${theme.spacing(1)};
`
)

const ScopeTypography = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
`

const AreaTypography = styled(Typography)`
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
`

const messages = {
  zone: 'zone',
  backTo: 'Retour sur en-marche.fr',
}

function Scopes() {
  const currentUser = useSelector(getCurrentUser)
  const [currentScope, updateCurrentScope] = useUserScope()
  const userScopes = useSelector(getUserScopes)
  const navigate = useNavigate()
  const filteredScopes = userScopes.filter(scope => scope.apps.includes('data_corner'))
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const redirect = scope => {
    if (scope.code === 'phoning_national_manager') {
      return navigate(paths.teams)
    }
    return navigate(paths.dashboard)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChange = userScope => {
    updateCurrentScope(userScope)
    setAnchorEl(null)
    redirect(userScope)
  }
  return (
    <Grid>
      {currentUser && filteredScopes?.length > 0 && (
        <>
          <Button onClick={handleClick}>
            {currentUser.firstName} {currentUser.lastName}
            <img src={vector} alt="caret" />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiMenu-paper': {
                bgcolor: 'menu.background.main',
                width: '243px',
              },
            }}
          >
            <MenuItem
              sx={{
                '&:hover': {
                  color: 'menu.color.main',
                  bgcolor: 'menu.background.hover',
                },
              }}
            >
              <ScopeTypography>
                <a href={process.env.REACT_APP_OAUTH_HOST}>{messages.backTo}</a>
              </ScopeTypography>
            </MenuItem>

            {filteredScopes?.length > 1 && <Divider sx={{ bgcolor: 'menu.background.active' }} />}

            {filteredScopes?.map((userScope, i) => (
              <MenuItem
                key={i}
                onClick={() => handleChange(userScope)}
                disableGutters
                sx={{
                  color: userScope?.code === currentScope?.code ? 'menu.color.active' : 'menu.color.main',
                  bgcolor: userScope?.code === currentScope?.code ? 'menu.background.active' : 'menu.background.main',
                  '&:hover': {
                    bgcolor:
                      userScope?.code === currentScope?.code ? 'menu.background.active' : 'menu.background.hover',
                  },
                }}
              >
                <ScopeTypography>{userScope?.name}</ScopeTypography>
                {userScope?.zones?.length === 1 && (
                  <AreaTypography>
                    {userScope.zones[0].name} ({userScope.zones[0].code})
                  </AreaTypography>
                )}
                {userScope?.zones?.length > 1 && (
                  <AreaTypography>
                    {`${userScope.zones[0].name} (${userScope.zones[0].code})`} + {userScope.zones.slice(1).length}
                    {pluralize(userScope.zones.slice(1).length, messages.zone)}
                  </AreaTypography>
                )}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Grid>
  )
}

export default Scopes
