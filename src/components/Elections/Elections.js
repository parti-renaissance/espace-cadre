import { useEffect, useRef, useState, useCallback } from 'react'
import { Grid } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from '!mapbox-gl'
import { getElectionParticipation, getElectionResults } from 'api/elections'

import { ElectionFirstStage, ElectionTypes } from './shared/constants'
import ElectionPopin from './ElectionPopin'

import 'mapbox-gl/dist/mapbox-gl.css'

import { getElectionPayload, getMapBoxProperties } from './shared/helpers'
import ElectionFilters from './ElectionFilters'
import PageTitle from 'ui/PageTitle'
import { LayersCodes, LayersTypes } from 'components/Map/Layers'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Map = styled(Grid)`
  height: 85vh;
  margin: ${({ theme }) => theme.spacing(1, 0, 2)};
`

const messages = {
  title: 'Élections',
}

const Elections = () => {
  const mapContainer = useRef(null)
  const map = useRef()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentPoint, setCurrentPoint] = useState()
  const [activeLayer, setActiveLayer] = useState(LayersCodes.region)

  const [isPopinOpen, setIsPopinOpen] = useState(false)
  const [isPopinLoaderActive, setIsPopinLoaderActive] = useState(false)

  const [participation, setParticipation] = useState([])
  const [results, setResults] = useState([])
  const [zone, setZone] = useState()
  const [filterValues, setFilterValues] = useState({
    election: ElectionTypes.Presidential,
    year: 2017,
    round: ElectionFirstStage,
  })

  const handleCurrentPoint = useCallback(({ point, lngLat }) => {
    if (!point || !lngLat) return
    setCurrentPoint({ point, lngLat })
  }, [])

  const switchLayer = useCallback(() => {
    Object.keys(LayersTypes).map(key => {
      map.current.setLayoutProperty(key, 'visibility', key === activeLayer ? 'visible' : 'none')
    })
  }, [map, activeLayer])

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE,
      minZoom: 4,
    })
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
  }, [])

  useEffect(() => {
    if (!map.current) return
    map.current.getCanvas().style.cursor = 'pointer'
    map.current.on('load', () => setMapLoaded(true))
    map.current.on('click', handleCurrentPoint)
  }, [map, handleCurrentPoint])

  useEffect(() => {
    if (!mapLoaded) return
    switchLayer()
    const { election, year, round } = filterValues
    map.current.setPaintProperty(activeLayer, 'fill-color', [
      'coalesce',
      ['get', `${election.charAt(0)}_${year}_${round}`],
      'rgba(0,0,0,0)',
    ])
  }, [mapLoaded, switchLayer, filterValues, map, activeLayer])

  useEffect(() => {
    if (!mapLoaded || !currentPoint) return

    const mapBoxProps = map.current.queryRenderedFeatures(currentPoint.point, { layers: [activeLayer] })
    if (!mapBoxProps) return

    const { zoneName, zoneCode } = getMapBoxProperties(mapBoxProps)
    if (zoneName) setZone(zoneName)

    const params = getElectionPayload(activeLayer, filterValues, zoneCode)
    if (Object.values(params).filter(p => p).length !== Object.keys(params).length) return

    setIsPopinOpen(true)
    setIsPopinLoaderActive(true)
    getElectionParticipation(params, setParticipation)
    getElectionResults(params, data => {
      setResults(data)
      setIsPopinLoaderActive(false)
    })
  }, [mapLoaded, currentPoint, map, activeLayer, filterValues])

  const handleElectionDetailChange = event => {
    const parts = event.target.value.split('_')
    const [election, year, round] = parts
    setFilterValues({ election, year, round })
  }

  return (
    <>
      <PageTitle title={messages.title} />
      <ElectionFilters
        filterValues={filterValues}
        handleTypeSelection={e => setActiveLayer(e.target.value)}
        handleDetailSelection={handleElectionDetailChange}
      />
      <Map ref={mapContainer} item>
        {isPopinOpen && (
          <ElectionPopin
            loader={isPopinLoaderActive}
            zone={zone}
            filterValues={filterValues}
            participation={participation[0] || {}}
            results={results}
            handleClose={() => setIsPopinOpen(false)}
          />
        )}
      </Map>
    </>
  )
}

export default Elections
