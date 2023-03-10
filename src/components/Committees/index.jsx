import { Route, Routes } from 'react-router-dom'
import Committees from 'components/Committees/Committees'
import DetailCommittee from './DetailCommittee'
import Elections from './Elections'

const CommitteeRoute = () => (
  <Routes>
    <Route path="*" element={<Committees />} />
    <Route path=":committeeId/*">
      <Route path="*" element={<DetailCommittee />} />
      <Route path="elections/:committeeElectionId" element={<Elections />} />
    </Route>
  </Routes>
)

export default CommitteeRoute
