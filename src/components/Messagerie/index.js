import Dashboard from 'components/Messagerie/Dashboard'
import { Route, Routes } from 'react-router-dom'
import Template from 'components/Messagerie/Template'
import Filters from 'components/Messagerie/Filters'
import Confirmation from 'components/Messagerie/Confirmation'

const MessagerieRoute = () => (
  <Routes>
    <Route path="*" element={<Dashboard />} />
    <Route path="creer" element={<Template />} />
    <Route path=":messageUuid/*">
      <Route path="modifier" element={<Template />} />
      <Route path="filtrer" element={<Filters />} />
    </Route>
    <Route path="confirmation" element={<Confirmation />} />
  </Routes>
)

export default MessagerieRoute
