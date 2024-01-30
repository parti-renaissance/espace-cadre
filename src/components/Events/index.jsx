import { Route, Routes } from 'react-router-dom'
import Events from '~/components/Events/Events'
import Event from '~/components/Events/Event/Event'

const EventRoute = () => (
  <Routes>
    <Route path="*" element={<Events />} />
    <Route path=":eventId" element={<Event />} />
  </Routes>
)

export default EventRoute
