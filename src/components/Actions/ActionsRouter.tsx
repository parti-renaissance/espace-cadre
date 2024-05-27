import { Route, Routes } from 'react-router-dom'
import ActionsListPage from '~/components/Actions/Page/ActionsListPage'

export default function ActionsRouter() {
  return (
    <Routes>
      <Route path="/" element={<ActionsListPage />} />
    </Routes>
  )
}
