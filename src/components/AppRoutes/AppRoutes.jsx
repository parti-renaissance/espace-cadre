import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, useLocation, createBrowserRouter, createRoutesFromElements, useRouteError } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getCurrentUser, getUserScopes, isUserLogged } from '~/redux/user/selectors'
import { useGetUserData, useInitializeAuth } from '~/redux/auth/hooks'
import { useUserScope } from '~/redux/user/hooks'
import ScopesPage from '~/components/Scopes/ScopesPage'
import BootPage from '~/components/BootPage'
import Auth from '~/components/Auth'
import { publicPaths } from '~/shared/paths'
import Signup from '~/components/Signup/Signup'
import SignupConfirm from '~/components/Signup/SignupConfirm'
import LegalContainer from '../Signup/components/LegalContainer'
import { CGUMobile, CGUWeb, CookiesMobile, CookiesWeb, Ppd } from '../Signup/constants'
import Sidebar from '~/components/Layout/Sidebar'
import Logout from '../Logout/Logout'
import * as Sentry from '@sentry/react'
import ErrorComponent from '~/components/ErrorComponent'
import { useLocalStorage } from 'react-use'

const publicPathsArray = [
  publicPaths.signup,
  publicPaths.auth,
  publicPaths.ppd,
  publicPaths.cguWeb,
  publicPaths.cguMobile,
  publicPaths.cookiesWeb,
  publicPaths.cookiesMobile,
]

const PrivatePages = ({ children }) => {
  const initializeAuth = useInitializeAuth()
  const { pathname, search } = useLocation()
  const isUserLoggedIn = useSelector(isUserLogged)
  const currentUser = useSelector(getCurrentUser)
  const [currentScope, updateCurrentScope] = useUserScope()
  const userScopes = useSelector(getUserScopes)
  const [, updateUserData] = useGetUserData()
  const forceScope = new URLSearchParams(search).get('scope')
  const redirect = new URLSearchParams(search).get('redirect')
  const [localCurrentScope, setLocalCurrentScope] = useLocalStorage('forceScope')
  const [tempRedirect, setTempRedirect] = useLocalStorage('tempRedirect')

  useEffect(() => {
    if (forceScope) {
      setLocalCurrentScope(forceScope)
    }

    if (redirect && !isUserLoggedIn) {
      setTempRedirect(redirect)
    }

    if ((tempRedirect || redirect) && isUserLoggedIn && currentScope !== null) {
      const tr = tempRedirect ?? redirect
      setTempRedirect(null)
      if (tr) {
        window.location.href = window.location.origin + tr
      }
    }

    if (localCurrentScope && userScopes.length > 0) {
      const forcedCurrentScope = userScopes.find(scope => scope.code === localCurrentScope)
      if (forcedCurrentScope) {
        updateCurrentScope(forcedCurrentScope.code).then(() => setLocalCurrentScope(null))
      }
    }

    if (isUserLoggedIn) {
      if (currentUser === null) {
        updateUserData()
      }
    } else if (!publicPathsArray.includes(pathname)) {
      initializeAuth()
    }
  }, [
    currentUser,
    initializeAuth,
    isUserLoggedIn,
    pathname,
    updateUserData,
    forceScope,
    localCurrentScope,
    userScopes,
    updateCurrentScope,
    setLocalCurrentScope,
    redirect,
    setTempRedirect,
    tempRedirect,
    currentScope,
  ])

  if (!currentUser || userScopes.length === 0) {
    return <BootPage />
  }
  if (userScopes && currentScope === null) {
    return <ScopesPage />
  }

  return <Sidebar>{children}</Sidebar>
}

PrivatePages.propTypes = {
  children: PropTypes.node.isRequired,
}

const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter)

const AppRoutes = ({ children }) =>
  sentryCreateBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<SentryRouteErrorFallback />}>
        <Route path={publicPaths.signup} element={<Signup />} />
        <Route path={publicPaths.signupConfirm} element={<SignupConfirm />} />
        <Route path={publicPaths.auth} element={<Auth />} />
        <Route path={publicPaths.logout} element={<Logout />} />
        <Route path={publicPaths.ppd} element={<LegalContainer type={Ppd} />} />
        <Route path={publicPaths.cguWeb} element={<LegalContainer type={CGUWeb} />} />
        <Route path={publicPaths.cguMobile} element={<LegalContainer type={CGUMobile} />} />
        <Route path={publicPaths.cookiesWeb} element={<LegalContainer type={CookiesWeb} />} />
        <Route path={publicPaths.cookiesMobile} element={<LegalContainer type={CookiesMobile} />} />
        <Route path="*" element={<PrivatePages>{children}</PrivatePages>} />
      </Route>
    )
  )

function SentryRouteErrorFallback() {
  const routeError = useRouteError()

  useEffect(() => Sentry.captureException(routeError), [routeError])

  return <ErrorComponent errorMessage={{ message: "Une erreur est survenue, merci de relancer l'application." }} />
}

AppRoutes.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppRoutes
