import { Route, Routes } from 'react-router-dom'
import ActionsListPage from '~/components/Actions/Page/ActionsListPage'
import { actionsRoutes } from '~/components/Actions/actionsRoutes'
import ActionsFormPage from '~/components/Actions/Page/ActionsFormPage'

export default function ActionsRouter() {
  return (
    <Routes>
      <Route path="/" element={<ActionsListPage />} />
      <Route path={actionsRoutes.create} element={<ActionsFormPage />} />
    </Routes>
  )
}
