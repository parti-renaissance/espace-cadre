import { Route, Routes } from 'react-router-dom'
import DepartmentSite from './DepartmentSite'

const SiteRoutes = () => (
  <Routes>
    <Route path="*" element={<DepartmentSite />} />
  </Routes>
)

export default SiteRoutes
