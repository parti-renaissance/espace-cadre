import { Route, Routes } from 'react-router-dom'
import Surveys from './Surveys'
import SurveyDetail from './SurveyDetail/SurveyDetail'

const SurveysRoute = () => (
  <Routes>
    <Route path="*" element={<Surveys />} />
    <Route path=":surveyId" element={<SurveyDetail />} />
  </Routes>
)

export default SurveysRoute
