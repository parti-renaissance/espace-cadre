import Dashboard from 'components/Messagerie/Dashboard'
import { Route, Routes } from 'react-router-dom'
import Template from 'components/Messagerie/Template'
import Filters from 'components/Messagerie/Filters'
import Confirmation from 'components/Messagerie/Confirmation'
import paths from 'components/Messagerie/shared/paths'

const MessagerieRoute = () => (
  <Routes>
    <Route path="*" element={<Dashboard />} />
    <Route path={paths.create} element={<Template />} />
    <Route path=":messageUuid/*">
      <Route path={paths.update} element={<Template />} />
      <Route path={paths.filter} element={<Filters />} />
    </Route>
    <Route path={paths.confirmation} element={<Confirmation />} />
  </Routes>
)

export default MessagerieRoute
