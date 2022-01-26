import { Route, Routes } from 'react-router-dom'
import MyTeam from './MyTeam'

const MyTeamRoute = () => (
  <Routes>
    <Route path="" element={<MyTeam />} />
  </Routes>
)

export default MyTeamRoute
