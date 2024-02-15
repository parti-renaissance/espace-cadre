import { Route, Routes } from 'react-router-dom'
import { ListEvents } from '~/components/Events/pages'

const EventRoute = () => (
  <Routes>
    <Route path="*" element={<ListEvents />} />
    {/*<Route path=":eventId" element={<DetailEvent />} />*/}
  </Routes>
)

export default EventRoute
