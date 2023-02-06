import { Route, Routes } from 'react-router-dom'
import ElectedRepresentative from './Dashboard'

const ElectedRoutes = () => (
  <Routes>
    <Route path="*" element={<ElectedRepresentative />} />
  </Routes>
)

export default ElectedRoutes
