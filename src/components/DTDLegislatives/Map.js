import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { styled } from '@mui/system'
import { Grid } from '@mui/material'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Container = styled(Grid)`
  border-radius: 12px;
`

function Map() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(2.8319)
  const [lat, setLat] = useState(46.9145)
  const [zoom, setZoom] = useState(5)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE,
      center: [lng, lat],
      zoom: zoom,
    })
  })

  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
    })
  })

  return <Container ref={mapContainer} className="map-container" />
}

export default Map
