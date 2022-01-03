import { Route, Routes } from 'react-router-dom'
import Phoning from './Phoning'
import PhoningCampaignDetail from './CampaignDetail/CampaignDetail'

const PhoningRoute = () => (
  <Routes>
    <Route path="" element={<Phoning />} />
    <Route path=":campaignId" element={<PhoningCampaignDetail />} />
  </Routes>
)

export default PhoningRoute
