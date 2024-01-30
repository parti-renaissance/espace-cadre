import { Route, Routes } from 'react-router-dom'
import Groups from '~/components/Groups/Groups'
import GroupEdit from '~/components/Groups/GroupEdit'
import paths from '~/components/Groups/shared/paths'

const GroupsRoute = () => (
  <Routes>
    <Route path="" element={<Groups />} />
    <Route path={`:groupId/${paths.update}`} element={<GroupEdit />} />
  </Routes>
)

export default GroupsRoute
