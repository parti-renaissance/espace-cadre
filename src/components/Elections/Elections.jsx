import { useEffect, useRef, useState, useCallback } from 'react'
import { Container, Grid } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from 'mapbox-gl'
import { getElectionParticipation, getElectionResults } from 'api/elections'

import { ElectionFirstStage, ElectionTypes } from './shared/constants'
import ElectionPopin from './ElectionPopin'

import 'mapbox-gl/dist/mapbox-gl.css'

import { getElectionPayload, getMapBoxProperties } from './shared/helpers'
import ElectionFilters from './ElectionFilters'
import PageTitle from 'ui/PageTitle'
import { LayersCodes, LayersTypes } from 'components/Map/Layers'
import { MAPBOX_TOKEN } from 'shared/environments'
import { createMap } from 'providers/map'

mapboxgl.accessToken = MAPBOX_TOKEN

const Map = styled(Grid)`
  height: calc(100% - 135px);
  width: 100%;
  margin: ${({ theme }) => theme.spacing(1, 0, 2)};
  border-radius: 12px;
`

const messages = {
  title: 'Élections',
}

const Elections = () => {
  const mapContainer = useRef(null)
  const map = useRef()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentPoint, setCurrentPoint] = useState()
  const [activeLayer, setActiveLayer] = useState(LayersCodes.circonscription)

  const [isPopinOpen, setIsPopinOpen] = useState(false)
  const [isPopinLoaderActive, setIsPopinLoaderActive] = useState(false)

  const [participation, setParticipation] = useState([])
  const [results, setResults] = useState([])
  const [zone, setZone] = useState()
  const [filterValues, setFilterValues] = useState({
    election: ElectionTypes.Presidential,
    year: 2022,
    round: ElectionFirstStage,
  })

  const handleCurrentPoint = useCallback(({ point, lngLat }) => {
    if (!point || !lngLat) {
      return
    }
    setCurrentPoint({ point, lngLat })
  }, [])

  const switchLayer = useCallback(() => {
    Object.keys(LayersTypes).map(key => {
      map.current.setLayoutProperty(key, 'visibility', key === activeLayer ? 'visible' : 'none')
    })
  }, [map, activeLayer])

  useEffect(() => {
    map.current = createMap(mapContainer.current)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
  }, [])

  useEffect(() => {
    if (!map.current) {
      return
    }
    map.current.getCanvas().style.cursor = 'pointer'
    map.current.on('load', () => setMapLoaded(true))
    map.current.on('click', handleCurrentPoint)
  }, [map, handleCurrentPoint])

  useEffect(() => {
    if (!mapLoaded) {
      return
    }
    switchLayer()
    const { election, year, round } = filterValues
    map.current.setPaintProperty(activeLayer, 'fill-color', [
      'coalesce',
      ['get', `${election.charAt(0)}_${year}_${round}`],
      'rgba(0,0,0,0)',
    ])
    map.current.setPaintProperty(activeLayer, 'fill-outline-color', '#095228')
  }, [mapLoaded, switchLayer, filterValues, map, activeLayer])

  useEffect(() => {
    if (!mapLoaded || !currentPoint) {
      return
    }

    const mapBoxProps = map.current.queryRenderedFeatures(currentPoint.point, { layers: [activeLayer] })
    if (!mapBoxProps) {
      return
    }

    const { zoneName, zoneCode } = getMapBoxProperties(mapBoxProps)
    if (zoneName) {
      setZone(zoneName)
    }

    const params = getElectionPayload(activeLayer, filterValues, zoneCode)
    if (Object.values(params).filter(p => p).length !== Object.keys(params).length) {
      return
    }

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
    <Container maxWidth={false} sx={{ height: '100%' }}>
      <Grid container>
        <PageTitle title={messages.title} />
      </Grid>
      <Grid container>
        <ElectionFilters
          filterValues={filterValues}
          handleTypeSelection={e => setActiveLayer(e.target.value)}
          handleDetailSelection={handleElectionDetailChange}
        />
      </Grid>
      <Grid container height="100%">
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
      </Grid>
    </Container>
  )
}

export default Elections
