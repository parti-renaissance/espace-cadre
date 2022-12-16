import { Fragment, useState } from 'react'
import { styled } from '@mui/system'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Grid, Menu as MuiMenu, MenuItem as MuiMenuItem, Typography } from '@mui/material'
import { Menu, Transition } from '@headlessui/react'
import { getCurrentUser, getUserScopes, isSwitchUser } from '../../redux/user/selectors'
import { useUserScope } from '../../redux/user/hooks'
import paths, { publicPaths } from 'shared/paths'
import pluralize from 'components/shared/pluralize/pluralize'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { classNames, getInitialNames } from 'shared/helpers'

const MenuM = styled(MuiMenu)`
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
    <Grid>
      {currentUser && filteredScopes?.length > 0 && (
        <>
          <Menu as="div" className="relative">
            <div className="flex items-center justify-center">
              <Menu.Button className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full bg-re-blue-100 text-re-blue-900 hover:bg-re-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {getInitialNames(currentScope?.name)}
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {filteredScopes?.map(userScope => (
                    <Menu.Item key={userScope.code}>
                      {({ active }) => (
                        <a
                          href="javascript:void"
                          onClick={() => handleChange(userScope)}
                          className={classNames(
                            userScope?.code === currentScope?.code
                              ? 'bg-re-blue-500 text-white'
                              : 'text-gray-700 hover:bg-gray-100',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          {userScope.name}
                          {userScope.zones?.length === 1 && (
                            <span
                              className={classNames(
                                userScope?.code === currentScope?.code ? 'text-re-blue-100' : 'text-gray-400',
                                'block mt-0.5 text-xs leading-4'
                              )}
                            >
                              {userScope.zones[0].name} ({userScope.zones[0].code})
                            </span>
                          )}
                          {userScope.zones?.length > 1 && (
                            <span
                              className={classNames(
                                userScope?.code === currentScope?.code ? 'text-re-blue-100' : 'text-gray-400',
                                'block mt-0.5 text-xs leading-4'
                              )}
                            >
                              {`${userScope.zones[0].name} (${userScope.zones[0].code})`} +{' '}
                              {userScope.zones.slice(1).length}
                              &nbsp;
                              {pluralize(userScope.zones.slice(1).length, messages.zone)}
                            </span>
                          )}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
          {/* <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={handleClose}>
            <Logout onClick={logout}>
              <Scope>{isSwitchedUser ? messages.exitSwitchUser : messages.logout}</Scope>
            </Logout>
          </Menu> */}
        </>
      )}
    </Grid>
  )
}

export default Scopes
