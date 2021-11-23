import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes as RRRoutes, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAuthorizedPages } from './redux/user/selectors'
import { CircularProgress, Grid } from '@mui/material'

const Dashboard = lazy(() => import('./components/Dashboard'))
const Adherents = lazy(() => import('./components/Adherents'))
const Messagerie = lazy(() => import('./components/Messagerie'))
const Elections = lazy(() => import('./components/Elections/Elections'))
const Ripostes = lazy(() => import('./components/Ripostes'))
const Teams = lazy(() => import('./components/Teams'))
const News = lazy(() => import('./components/News'))
const NoMatch = lazy(() => import('./components/NoMatch'))

const Routes = () => {
  const location = useLocation()
  const authorizedPages = useSelector(getAuthorizedPages)

  useEffect(() => window.scrollTo(0, 0), [location])

  return (
    <Suspense fallback={<Spinner />}>
      <RRRoutes>
        <Route path="*" element={<NoMatch />} />
        <Route path="/" element={authorizedPages.includes('dashboard') && <Dashboard />} />
        <Route path="/adherents" element={authorizedPages.includes('contacts') && <Adherents />} />
        <Route path="/messagerie/*" element={authorizedPages.includes('messages') && <Messagerie />} />
        <Route path="/elections" element={authorizedPages.includes('elections') && <Elections />} />
        <Route path="/ripostes" element={authorizedPages.includes('ripostes') && <Ripostes />} />
        <Route path="/equipes/*" element={authorizedPages.includes('team') && <Teams />} />
        <Route path="/actualites" element={authorizedPages.includes('news') && <News />} />
      </RRRoutes>
    </Suspense>
  )
}

export default Routes

const Spinner = () => (
  <Grid container style={{ marginTop: 'calc(100vh - 70vh)', textAlign: 'center' }}>
    <Grid item xs={12}>
      <CircularProgress style={{ color: '#0049C6' }} />
    </Grid>
    <Grid item xs={12}>
      <strong>Page en cours de chargement</strong>
    </Grid>
  </Grid>
)
