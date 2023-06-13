import { Route, Routes } from 'react-router-dom'
import { paths } from 'components/Messagerie/shared/paths'
import Confirmation from 'components/Messagerie/Confirmation'
import Template from './Template'
import Mails from './Mails'
import SendMail from './SendMail'

const MailsRoute = () => (
  <Routes>
    <Route path="*" element={<Mails />} />
    <Route path={paths.create} element={<Template />} />
    <Route path=":messageUuid/*">
      <Route path={paths.send} element={<SendMail />} />
    </Route>
    <Route path={paths.confirmation} element={<Confirmation />} />
  </Routes>
)

export default MailsRoute
