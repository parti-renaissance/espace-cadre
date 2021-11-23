import { Route, Routes } from 'react-router-dom'
import Teams from 'components/Teams/Teams'
import TeamEdit from 'components/Teams/TeamEdit'

const TeamsRoute = () => (
  <Routes>
    <Route path="" element={<Teams />} />
    <Route path=":teamId/editer" element={<TeamEdit />} />
  </Routes>
)

export default TeamsRoute
