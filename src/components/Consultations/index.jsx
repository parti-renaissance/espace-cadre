import { Route, Routes } from 'react-router-dom'
import List from '~/components/Consultations/List'

const ConsultationsRoutes = () => (
  <Routes>
    <Route path="*" element={<List />} />
  </Routes>
)

export default ConsultationsRoutes
