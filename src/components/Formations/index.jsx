import { Route, Routes } from 'react-router-dom'
import Formations from '~/components/Formations/Formations'

const FormationRoute = () => (
  <Routes>
    <Route path="*" element={<Formations />} />
  </Routes>
)

export default FormationRoute
