import { Route, Routes } from 'react-router-dom'
import Phoning from './Phoning'
import PhoningCampaign from './PhoningCampaign'

const PhoningRoute = () => (
  <Routes>
    <Route path="" element={<Phoning />} />
    <Route path=":campaignId" element={<PhoningCampaign />} />
  </Routes>
)

export default PhoningRoute
