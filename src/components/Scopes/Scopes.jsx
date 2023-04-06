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
import scopes, { scopesAliases } from 'shared/scopes'

const Menu = styled(MuiMenu)`
  & .MuiMenu-paper {
    background: ${({ theme }) => theme.palette.colors.white};
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    width: 224px;
    padding: 4px 0;
    margin-top: 8px;
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
  padding: ${theme.spacing(1, 2)};
  margin-bottom: ${theme.spacing(1)};
  color: ${userScope?.code === currentScope?.code ? theme.palette.colors.white : theme.palette.colors.gray['700']};
  background-color: ${userScope?.code === currentScope?.code ? theme.palette.colors.blue['500'] : 'transparent'};
  &:hover {
    background-color: ${
      userScope?.code === currentScope?.code ? theme.palette.colors.blue['500'] : theme.palette.colors.gray['100']
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
  align-items: center;
  padding: ${theme.spacing(1, 2)};
  color: ${theme.palette.colors.gray['700']};
  background-color: ${theme.palette.colors.gray['50']};
  &:hover {
    background-color: ${theme.palette.colors.gray['100']};
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
    if (scope.code === scopes.phoning_national_manager) return navigate(paths.phoning_campaign)
    if (scope.code === scopes.pap_national_manager) return navigate(paths.pap)
    return navigate(paths.dashboard)
  }

  const handleClose = () => {
    setMenuAnchor(null)
  }

  const handleChange = userScope => {
    updateCurrentScope(userScope.code)
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
            {scopesAliases[currentScope.delegated_access?.type || currentScope.code] ||
              getInitialNames(currentScope?.name)}
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
