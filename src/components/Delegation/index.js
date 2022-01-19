import { Route, Routes } from 'react-router-dom'
import Delegation from './Delegation'

const DelegationRoute = () => (
  <Routes>
    <Route path="" element={<Delegation />} />
  </Routes>
)

export default DelegationRoute
