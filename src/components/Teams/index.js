import { Route, Routes } from 'react-router-dom'
import Teams from 'components/Teams/Teams'
import TeamEdit from 'components/Teams/TeamEdit'
import paths from 'components/Teams/shared/paths'

const TeamsRoute = () => (
  <Routes>
    <Route path="" element={<Teams />} />
    <Route path={`:teamId/${paths.update}`} element={<TeamEdit />} />
  </Routes>
)

export default TeamsRoute
