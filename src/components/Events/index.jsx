import { Route, Routes } from 'react-router-dom'
import { ListEvents, CreateOrEditEvent, DetailEvent } from '~/components/Events/pages'
import { paths } from '~/components/Events/shared/paths'

const EventRoute = () => (
  <Routes>
    <Route path="*" element={<ListEvents />} />
    <Route path="/:eventId" element={<DetailEvent />} />

    {/* Create an event */}
    <Route path={paths.create} element={<CreateOrEditEvent />} />

    {/* Edit an event */}
    <Route path={`${paths.update}/:eventId`} element={<CreateOrEditEvent editable={true} />} />
  </Routes>
)

export default EventRoute
