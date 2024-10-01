import { Route, Routes } from 'react-router-dom'
import List from '~/components/Consultations/List'
import Edit from '~/components/Consultations/Edit'
import { paths } from '~/components/Consultations/paths'

const ConsultationsRoutes = () => (
  <Routes>
    <Route path="*" element={<List />} />
    <Route path={paths.new_consultation} element={<Edit />} />
    <Route path={paths.new_ag_vote} element={<Edit isAg={true} />} />
  </Routes>
)

export default ConsultationsRoutes
