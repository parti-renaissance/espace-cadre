import { Route, Routes } from 'react-router-dom'
import Dashboard from '~/components/Messagerie/pages/dashboard'
import NewsletterEditor from '~/components/Messagerie/pages/manage/editor/newsletter/editor'
import Filters from '~/components/Messagerie/pages/manage/recipients'
import Confirmation from '~/components/Messagerie/pages/manage/confirmation'
import CreateTypePage from '~/components/Messagerie/pages/manage/type'
import CreateIndex from '~/components/Messagerie/pages/manage'
import { paths as messageriePaths } from '~/components/Messagerie/shared/paths'
import EditorsIndex from '~/components/Messagerie/pages/manage/editor'
import PreviewPage from './pages/manage/preview'

const MessagerieRoute = () => (
  <Routes>
    <Route path="*" element={<Dashboard />} />
    <Route path={messageriePaths.create} element={<CreateIndex />}>
      <Route index element={<CreateTypePage />} />
      <Route path=":type/*">
        <Route index element={<EditorsIndex />} />
        <Route path={messageriePaths.unlayer} element={<NewsletterEditor />} />
      </Route>
    </Route>
    <Route path={messageriePaths.update} element={<CreateIndex />}>
      <Route path=":type/*">
        <Route path=":id/*">
          <Route index element={<EditorsIndex />} />
          <Route path={messageriePaths.preview} element={<PreviewPage />} />
          <Route path={messageriePaths.unlayer} element={<NewsletterEditor />} />
          <Route path={messageriePaths.filter} element={<Filters />} />
        </Route>
      </Route>
    </Route>
    {/* <Route path=":type/*">
      <Route path="*" element={<Template />} />
      <Route path=":messageUuid/*">
        <Route path={messageriePaths.update} element={<Template modeUpdate />} />
        <Route path={messageriePaths.filter} element={<Filters />} />
      </Route>
    </Route> */}
    <Route path={messageriePaths.confirmation} element={<Confirmation />} />
  </Routes>
)

export default MessagerieRoute
