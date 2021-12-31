import { Route, Routes } from 'react-router-dom'
import Phoning from './Phoning'
import PhoningCampaignDetail from './CampaignDetail/CampaignDetail'
import { useAppState } from 'providers/state'

const PhoningRoute = () => (
  <Routes>
    <Route path="" element={<Phoning />} />
    <Route path=":campaignId" element={<PhoningCampaignDetail />} />
  </Routes>
)

export const usePhoningCreateEditState = () => useAppState().phoning.createEdit

export default PhoningRoute
