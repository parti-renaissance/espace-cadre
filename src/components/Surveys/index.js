import { Route, Routes } from 'react-router-dom'
import Surveys from './Surveys'

const SurveysRoute = () => (
  <Routes>
    <Route path="" element={<Surveys />} />
  </Routes>
)

export default SurveysRoute
