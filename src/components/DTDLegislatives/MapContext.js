import { createContext } from 'react'

const MapContext = createContext({
  pollingStationSelection: {},
  setPollingStationSelection: () => {},
})

export default MapContext
