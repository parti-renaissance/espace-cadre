import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  Route,
  useLocation,
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
  useNavigate,
} from 'react-router-dom'
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
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const searchParams = useMemo(() => new URLSearchParams(search), [search])
  const forceScope = searchParams.get('scope')
  const redirect = searchParams.get('redirect')

  const initializeAuth = useInitializeAuth()
  const isUserLoggedIn = useSelector(isUserLogged)
  const currentUser = useSelector(getCurrentUser)
  const [currentScope, updateCurrentScope] = useUserScope()
  const userScopes = useSelector(getUserScopes)
  const [, updateUserData] = useGetUserData()

  const redirectCallback = useCallback(() => {
    searchParams.delete('scope')
    navigate({ pathname: redirect ?? pathname, search: searchParams.toString() }, { replace: true })
  }, [navigate, pathname, redirect, searchParams])

  useEffect(() => {
    if (!isUserLoggedIn) {
      if (!publicPathsArray.includes(pathname)) {
        initializeAuth()
      }
      return
    }

    if (currentUser === null) {
      updateUserData()
      return
    }

    if (userScopes.length === 0) {
      return
    }

    const scopeToSelect = userScopes.length === 1 ? userScopes[0].code : forceScope

    const forcedCurrentScope = userScopes.find(scope => scope.code === scopeToSelect)
    if (forcedCurrentScope && (currentScope === null || currentScope.code !== forcedCurrentScope.code)) {
      updateCurrentScope(forcedCurrentScope.code).then(redirectCallback)
    }
  }, [
    currentUser,
    initializeAuth,
    isUserLoggedIn,
    pathname,
    updateUserData,
    forceScope,
    userScopes,
    updateCurrentScope,
    redirect,
    currentScope,
    redirectCallback,
  ])

  if (!currentUser || userScopes.length === 0 || (currentScope === null && userScopes.length === 1) || forceScope) {
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

  useEffect(() => {
    Sentry.captureException(routeError)
  }, [routeError])

  return <ErrorComponent errorMessage={{ message: "Une erreur est survenue, merci de relancer l'application." }} />
}

AppRoutes.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppRoutes
