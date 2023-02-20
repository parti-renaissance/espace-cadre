import { Route, Routes } from 'react-router-dom'
import Committees from 'components/Committees/Committees'

const CommitteeRoute = () => (
  <Routes>
    <Route path="*" element={<Committees />} />
  </Routes>
)

export default CommitteeRoute
