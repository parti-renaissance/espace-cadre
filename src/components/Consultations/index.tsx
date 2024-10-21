import { Route, Routes } from 'react-router-dom'
import List from '~/components/Consultations/List'
import { paths } from '~/components/Consultations/paths'
import EditPageWrapper from '~/components/Consultations/Edit/EditPageWrapper'
import Show from '~/components/Consultations/Show/Show'
import { DesignationTypeEnum } from '~/domain/designation'

const ConsultationsRoutes = () => (
  <Routes>
    <Route path="*" element={<List />} />
    <Route path={paths.new_consultation} element={<EditPageWrapper type={DesignationTypeEnum.Consultation} />} />
    <Route path={paths.new_ag_vote} element={<EditPageWrapper type={DesignationTypeEnum.Vote} />} />
    <Route path=":uuid/modifier" element={<EditPageWrapper />} />
    <Route path=":uuid" element={<Show />} />
  </Routes>
)

export default ConsultationsRoutes
