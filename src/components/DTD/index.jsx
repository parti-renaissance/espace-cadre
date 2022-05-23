import { Route, Routes } from 'react-router-dom'
import DTD from './DTD'
import DTDCampaignDetail from './CampaignDetail/CampaignDetail'

const DoorKnockingRoute = () => (
  <Routes>
    <Route path="*" element={<DTD />} />
    <Route path=":campaignId" element={<DTDCampaignDetail />} />
  </Routes>
)

export default DoorKnockingRoute
