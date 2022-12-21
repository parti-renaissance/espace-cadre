import { useState } from 'react'
import { styled } from '@mui/system'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Grid, Menu as MuiMenu, MenuItem as MuiMenuItem, Typography, Divider } from '@mui/material'
import { getCurrentUser, getUserScopes, isSwitchUser } from '../../redux/user/selectors'
import { useUserScope } from '../../redux/user/hooks'
import paths, { publicPaths } from 'shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { getInitialNames } from 'shared/helpers'

const Menu = styled(MuiMenu)`
  & .MuiMenu-paper {
    background: ${({ theme }) => theme.palette.menu.background.main};
    width: 243px;
  }
`

const MenuItem = styled(
  MuiMenuItem,
  shouldForwardProps
)(
  ({ theme, userScope, currentScope }) => `
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  padding: ${theme.spacing(1, 2)};
  margin-bottom: ${theme.spacing(1)};
  color: ${userScope?.code === currentScope?.code ? theme.palette.menu.color.active : theme.palette.menu.color.main};
  background-color: ${
    userScope?.code === currentScope?.code ? theme.palette.menu.background.active : theme.palette.menu.background.main
  };
  &:hover {
    background-color: ${
      userScope?.code === currentScope?.code
        ? theme.palette.menu.background.active
        : theme.palette.menu.background.hover
    }
  },
  &:first-of-type {
    margin-top: ${theme.spacing(1)};
  }
  )
`
)

const Logout = styled(MuiMenuItem)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  padding: ${theme.spacing(1, 2)};
  margin-bottom: ${theme.spacing(1)};
  color: ${theme.palette.menu.color.main};
  background-color: ${theme.palette.menu.background.main};
  &:hover {
    background-color: ${theme.palette.menu.background.hover};
  },
  `
)

const Scope = styled(Typography)`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
`

const Area = styled(Typography)`
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
`

const messages = {
  zone: 'zone',
  logout: 'Me déconnecter',
  exitSwitchUser: 'Quitter l’impersonnification',
}

function Scopes() {
  const currentUser = useSelector(getCurrentUser)
  const [currentScope, updateCurrentScope] = useUserScope()
  const isSwitchedUser = useSelector(isSwitchUser)
  const userScopes = useSelector(getUserScopes)
  const navigate = useNavigate()
  const filteredScopes = userScopes.filter(scope => scope.apps.includes('data_corner'))
  const [menuAnchor, setMenuAnchor] = useState(null)

  const handleClick = event => {
    setMenuAnchor(event.currentTarget)
  }

  const redirect = scope => {
    // TODO: remove the 2 next lines when Dashboard page is ready on Phoning and Door to door
    if (scope.code === 'phoning_national_manager') return navigate(paths.phoning_campaign)
    if (scope.code === 'pap_national_manager') return navigate(paths.pap)
    return navigate(paths.dashboard)
  }

  const handleClose = () => {
    setMenuAnchor(null)
  }

  const handleChange = userScope => {
    updateCurrentScope(userScope)
    setMenuAnchor(null)
    redirect(userScope)
  }

  const logout = () => {
    navigate(publicPaths.logout)
  }

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {currentUser && filteredScopes?.length > 0 && (
        <>
          <button type="button" className="button button-circle mx-auto" onClick={handleClick} data-cy="scopes-button">
            {getInitialNames(currentScope?.name)}
          </button>
          <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={handleClose}>
            {filteredScopes?.map(userScope => (
              <MenuItem
                key={userScope.code}
                onClick={() => handleChange(userScope)}
                disableGutters
                userScope={userScope}
                currentScope={currentScope}
              >
                <Scope>{userScope.name}</Scope>
                {userScope.zones?.length === 1 && (
                  <Area>
                    {userScope.zones[0].name} ({userScope.zones[0].code})
                  </Area>
                )}
                {userScope.zones?.length > 1 && (
                  <Area>
                    {`${userScope.zones[0].name} (${userScope.zones[0].code})`} + {userScope.zones.slice(1).length}
                    &nbsp;
                    {pluralize(userScope.zones.slice(1).length, messages.zone)}
                  </Area>
                )}
              </MenuItem>
            ))}
            <Divider sx={{ bgcolor: 'whiteCorner' }} />
            <Logout onClick={logout}>
              <Scope>{isSwitchedUser ? messages.exitSwitchUser : messages.logout}</Scope>
            </Logout>
          </Menu>
        </>
      )}
    </Grid>
  )
}

export default Scopes
