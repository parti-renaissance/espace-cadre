import { Route, Routes } from 'react-router-dom'
import ElectedRepresentative from './Dashboard'
import ElectedDetail from './ElectedDetail'

const ElectedRoutes = () => (
  <Routes>
    <Route path="" element={<ElectedRepresentative />} />
    <Route path=":electedId" element={<ElectedDetail />} />
  </Routes>
)

export default ElectedRoutes
