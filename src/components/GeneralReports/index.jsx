import { Route, Routes } from 'react-router-dom'
import GeneralReports from '~/components/GeneralReports/GeneralReports'

const GeneralReportRoutes = () => (
  <Routes>
    <Route path="*" element={<GeneralReports />} />
  </Routes>
)

export default GeneralReportRoutes
