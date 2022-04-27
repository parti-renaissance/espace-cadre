import { createContext } from 'react'

const MapContext = createContext({
  pollingStationCode: '',
  setPollingStationCode: () => {},
})

export default MapContext
