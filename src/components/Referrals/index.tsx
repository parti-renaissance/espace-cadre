import { Route, Routes } from 'react-router-dom'
import Referrals from './Pages/Referrals.js'

const ReferralsRoute = () => (
  <Routes>
    <Route path="" element={<Referrals />} />
  </Routes>
)

export default ReferralsRoute
