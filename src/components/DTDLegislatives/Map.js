/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import { styled } from '@mui/system'
import { Grid } from '@mui/material'
import { LayersCodes } from 'components/Map/Layers'
import MapContext from './MapContext'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Container = styled(Grid)`
  border-radius: 12px;
`

function Map({ currentStep }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(2.8319)
  const [lat, setLat] = useState(46.9145)
  const [zoom, setZoom] = useState(5)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentPoint, setCurrentPoint] = useState()
  const [pollingStation, setPollingStation] = useState(null)

  const { setPollingStationCode } = useContext(MapContext)

  const handleCurrentPoint = useCallback(({ point, lngLat }) => {
    if (!point || !lngLat) return
    setCurrentPoint({ point, lngLat })
  }, [])

  const getMapBoxProperties = mapBoxProps => {
    const properties = mapBoxProps[0].properties
    return properties
  }

  const messages = {
    warning: "Cette carte n'est pas cliquable. Veuillez d'abord cliquer sur CIBLER.",
    title: 'Bureaux de vote',
    address: 'Adresse',
  }

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE,
      center: [lng, lat],
      zoom: zoom,
    })
  })

  useEffect(() => {
    if (!map.current) return
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
    map.current.getCanvas().style.cursor = 'pointer'
    map.current.on('load', () => setMapLoaded(true))
    map.current.on('click', handleCurrentPoint)
  }, [map, handleCurrentPoint])

  useEffect(() => {
    if (!mapLoaded) return
    map.current.setLayoutProperty(LayersCodes.pollingStationLegislatives, 'visibility', 'visible')
    map.current.setPaintProperty(LayersCodes.pollingStationLegislatives, 'fill-color', [
      'coalesce',
      ['get', 'COLOR'],
      'rgba(0,0,0,0)',
    ])
  }, [mapLoaded])

  useEffect(() => {
    if (!mapLoaded || !currentPoint) return

    const mapBoxProps = map.current.queryRenderedFeatures(currentPoint.point, {
      layers: [LayersCodes.pollingStationLegislatives],
    })
    if (!mapBoxProps[0]) return
    if (currentStep === 1) {
      return
    }

    const { CODE, ADDRESS } = getMapBoxProperties(mapBoxProps)
    if (CODE && ADDRESS) setPollingStation({ CODE, ADDRESS })
    setPollingStationCode(CODE)
  }, [mapLoaded, currentPoint, map, currentStep])

  return (
    <Container ref={mapContainer} className="map-container">
      <div className="infobar">
        {currentStep === 1 && <span>{messages.warning}</span>}
        {currentStep === 2 && pollingStation && (
          <span>{`${messages.title}: ${pollingStation?.CODE} | ${messages.address}: ${pollingStation?.ADDRESS}`}</span>
        )}
      </div>
    </Container>
  )
}

Map.propTypes = {
  currentStep: PropTypes.number,
}

export default Map
