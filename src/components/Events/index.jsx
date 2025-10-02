import { Route, Routes } from 'react-router-dom'
import { ListEvents } from '~/components/Events/pages'

const EventRoute = () => (
  <Routes>
    <Route path="*" element={<ListEvents />} />
  </Routes>
)

export default EventRoute
