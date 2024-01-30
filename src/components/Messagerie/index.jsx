import { Route, Routes } from 'react-router-dom'
import Dashboard from '~/components/Messagerie/Dashboard'
import Template from '~/components/Messagerie/Template'
import Filters from '~/components/Messagerie/Filters'
import Confirmation from '~/components/Messagerie/Confirmation'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'

const MessagerieRoute = () => (
  <Routes>
    <Route path="*" element={<Dashboard />} />
    <Route path={messageriePaths.create} element={<Template />} />
    <Route path=":messageUuid/*">
      <Route path={messageriePaths.update} element={<Template modeUpdate />} />
      <Route path={messageriePaths.filter} element={<Filters />} />
    </Route>
    <Route path={messageriePaths.confirmation} element={<Confirmation />} />
  </Routes>
)

export default MessagerieRoute
