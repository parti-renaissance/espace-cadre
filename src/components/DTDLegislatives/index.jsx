import { Route, Routes } from 'react-router-dom'
import DTDLegislatives from './DTDLegislatives'
import CampaignDetail from './CampaignDetail/CampaignDetail'

const DTDLegislativesRoute = () => (
  <Routes>
    <Route path="*" element={<DTDLegislatives />} />
    <Route path=":campaignId" element={<CampaignDetail />} />
  </Routes>
)

export default DTDLegislativesRoute
