import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from '../redux/user/selectors'
import { CircularProgress, Grid } from '@mui/material'
import paths from 'shared/paths'
import pages from 'shared/authorizedPages'

const Dashboard = lazy(() => import('components/Dashboard'))
const Adherents = lazy(() => import('components/Adherents'))
const Messagerie = lazy(() => import('components/Messagerie'))
const Elections = lazy(() => import('components/Elections/Elections'))
const Ripostes = lazy(() => import('components/Ripostes'))
const Teams = lazy(() => import('components/Teams'))
const News = lazy(() => import('components/News'))
const NoMatch = lazy(() => import('components/NoMatch'))

const AppRoutes = () => {
  const location = useLocation()
  const authorizedPages = useSelector(getAuthorizedPages)

  useEffect(() => window.scrollTo(0, 0), [location])

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="*" element={<NoMatch />} />
        <Route path={paths.dashboard} element={authorizedPages.includes(pages.dashboard) && <Dashboard />} />
        <Route path={paths.adherents} element={authorizedPages.includes(pages.adherents) && <Adherents />} />
        <Route path={`${paths.messagerie}/*`} element={authorizedPages.includes(pages.messagerie) && <Messagerie />} />
        <Route path={paths.elections} element={authorizedPages.includes(pages.elections) && <Elections />} />
        <Route path={paths.ripostes} element={authorizedPages.includes(pages.ripostes) && <Ripostes />} />
        <Route path={`${paths.teams}/*`} element={authorizedPages.includes(pages.teams) && <Teams />} />
        <Route path={paths.news} element={authorizedPages.includes(pages.news) && <News />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes

const spinerMessages = {
  loading: 'Page en cours de chargement',
}
const Spinner = () => (
  <Grid container style={{ marginTop: 'calc(100vh - 70vh)', textAlign: 'center' }}>
    <Grid item xs={12}>
      <CircularProgress sx={{ color: '#0049C6' }} />
    </Grid>
    <Grid item xs={12}>
      <strong>{spinerMessages.loading}</strong>
    </Grid>
  </Grid>
)
