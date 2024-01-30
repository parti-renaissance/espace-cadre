import { useState } from 'react'
import { styled } from '@mui/system'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Menu as MuiMenu, MenuItem as MuiMenuItem, Typography, Divider, Box } from '@mui/material'
import { getCurrentUser, getUserScopes, isSwitchUser } from '../../redux/user/selectors'
import { useUserScope } from '../../redux/user/hooks'
import paths, { publicPaths } from '~/shared/paths'
import pluralize from '~/components/shared/pluralize/pluralize'
import { shouldForwardProps } from '~/components/shared/shouldForwardProps'
import scopes, { scopesAliases } from '~/shared/scopes'
import Button from '~/ui/Button'
import { getInitialNames } from '~/shared/helpers'

const Menu = styled(MuiMenu)`
  & .MuiMenu-paper {
    background: ${({ theme }) => theme.palette.colors.white};
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
    width: 300px;
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
    if (scope.code === scopes.phoning_national_manager) {
      return navigate(paths.phoning_campaign)
    }
    if (scope.code === scopes.pap_national_manager) {
      return navigate(paths.pap)
    }
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
    <Box mt={1}>
      {currentUser && filteredScopes?.length > 0 && (
        <>
          <Button
            isMainButton
            onClick={handleClick}
            data-cy="scopes-button"
            rootProps={{
              sx: {
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left',
              },
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: '1 1 0%', mr: 1 }}
              className="truncate"
            >
              <Typography sx={{ pr: 1, fontSize: '16px', textTransform: 'none' }}>
                {scopesAliases[currentScope.delegatedAccess?.type || currentScope.code] ||
                  getInitialNames(currentScope?.name)}
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                sx={{
                  pl: 1,
                  borderLeft: '1px solid',
                  borderLeftColor: 'colors.blue.200',
                  flex: '1 1 0%',
                  overflow: 'hidden',
                  lineClamp: '1',
                }}
              >
                <Typography sx={{ fontSize: '16px', textTransform: 'capitalize' }} className="truncate">
                  {currentScope?.name}
                </Typography>
                <Typography sx={{ textTransform: 'capitalize', lineHeight: '10px' }}>
                  {currentScope.zones?.length === 1 && (
                    <Area>
                      {currentScope.zones[0].name} ({currentScope.zones[0].code})
                    </Area>
                  )}
                  {currentScope.zones?.length > 1 && (
                    <Area>
                      {`${currentScope.zones[0].name} (${currentScope.zones[0].code})`} +{' '}
                      {currentScope.zones.slice(1).length}
                      &nbsp;
                      {pluralize(currentScope.zones.slice(1).length, messages.zone)}
                    </Area>
                  )}
                </Typography>
              </Box>
            </Box>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
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
                {userScope.zones?.length > 0 && (
                  <Area>
                    {userScope.zones[0].name} ({userScope.zones[0].code})
                    {userScope.zones.length > 1 &&
                      ` + ${userScope.zones.slice(1).length} ${pluralize(
                        userScope.zones.slice(1).length,
                        messages.zone
                      )}`}
                  </Area>
                )}
                {userScope?.attributes?.committees?.length > 0 && (
                  <Area>{userScope.attributes.committees.map(committee => committee.name).join(', ')}</Area>
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
    </Box>
  )
}

export default Scopes
