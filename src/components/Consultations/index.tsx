import { Route, Routes } from 'react-router-dom'
import List from '~/components/Consultations/List'
import { paths } from '~/components/Consultations/paths'
import CreatePage from '~/components/Consultations/CreatePage'

const ConsultationsRoutes = () => (
  <Routes>
    <Route path="*" element={<List />} />
    <Route path={paths.new_consultation} element={<CreatePage />} />
    <Route path={paths.new_ag_vote} element={<CreatePage />} />
  </Routes>
)

export default ConsultationsRoutes
