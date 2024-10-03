import { Route, Routes } from 'react-router-dom'
import List from '~/components/Consultations/List'
import { paths } from '~/components/Consultations/paths'
import EditPageWrapper from '~/components/Consultations/EditPageWrapper'

const ConsultationsRoutes = () => (
  <Routes>
    <Route path="*" element={<List />} />
    <Route path={paths.new_consultation} element={<EditPageWrapper />} />
    <Route path={paths.new_ag_vote} element={<EditPageWrapper />} />
    <Route path=":uuid/modifier" element={<EditPageWrapper />} />
  </Routes>
)

export default ConsultationsRoutes
