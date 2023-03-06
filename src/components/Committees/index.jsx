import { Route, Routes } from 'react-router-dom'
import Committees from 'components/Committees/Committees'
import DetailCommittee from './DetailCommittee'

const CommitteeRoute = () => (
  <Routes>
    <Route path="*" element={<Committees />} />
    <Route path=":committeeId" element={<DetailCommittee />} />
  </Routes>
)

export default CommitteeRoute
