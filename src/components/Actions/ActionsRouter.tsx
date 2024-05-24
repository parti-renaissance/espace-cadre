import { Route, Routes } from 'react-router-dom'
import ListActions from '~/components/Actions/screens/ListActions'

export default function ActionsRouter() {
  return (
    <Routes>
      <Route path="/" element={<ListActions />} />
    </Routes>
  )
}
