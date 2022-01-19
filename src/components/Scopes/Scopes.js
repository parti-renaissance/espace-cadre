import { useState } from 'react'
import { styled } from '@mui/system'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Grid, Button as MuiButton, Menu as MuiMenu, MenuItem as MuiMenuItem, Typography } from '@mui/material'
import { getCurrentUser, getUserScopes } from '../../redux/user/selectors'
import { useUserScope } from '../../redux/user/hooks'
import paths from 'shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'

const Button = styled(MuiButton)(
  ({ theme }) => `
  display: flex;
  justify-content: space-between;
  align-item: center;
  text-transform: capitalize;
  color: ${theme.palette.menu.color.main};
  background: ${theme.palette.menu.background.hover};
  padding: ${theme.spacing(0.75, 2)};
  margin: ${theme.spacing(0, 2, 3)};
  border-radius: 6px;
  width: 243px;
`
)

const Menu = styled(MuiMenu)`
  & .MuiMenu-paper {
    background: ${({ theme }) => theme.palette.menu.background.main};
    width: 243px;
  }
`

const MenuItem = styled(MuiMenuItem, shouldForwardProps)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  padding: ${({ theme }) => theme.spacing(1, 2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme, userScope, currentScope }) =>
    userScope?.code === currentScope?.code ? theme.palette.menu.color.active : theme.palette.menu.color.main};
  background-color: ${({ theme, userScope, currentScope }) =>
    userScope?.code === currentScope?.code ? theme.palette.menu.background.active : theme.palette.menu.background.main};
  &:hover {
    background-color: ${({ theme, userScope, currentScope }) =>
      userScope?.code === currentScope?.code
        ? theme.palette.menu.background.active
        : theme.palette.menu.background.hover}
  },
)`

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
}

function Scopes() {
  const currentUser = useSelector(getCurrentUser)
  const [currentScope, updateCurrentScope] = useUserScope()
  const userScopes = useSelector(getUserScopes)
  const navigate = useNavigate()
  const filteredScopes = userScopes.filter(scope => scope.apps.includes('data_corner'))
  const [menuAnchor, setMenuAnchor] = useState(null)

  const handleClick = event => {
    setMenuAnchor(event.currentTarget)
  }

  const redirect = scope => {
    if (scope.code === 'phoning_national_manager') return navigate(paths.phoning)
    if (scope.code === 'pap_national_manager') return navigate(paths.DTD)
    if (scope.code === 'delegation') return navigate(paths.delegation)
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

  return (
    <Grid>
      {currentUser && filteredScopes?.length > 0 && (
        <>
          <Button onClick={handleClick}>
            {currentUser.firstName} {currentUser.lastName}
            <ExpandMoreRoundedIcon
              sx={{ transform: menuAnchor ? 'rotate(180deg)' : '', transition: 'transform 0.3s' }}
            />
          </Button>
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
          </Menu>
        </>
      )}
    </Grid>
  )
}

export default Scopes
