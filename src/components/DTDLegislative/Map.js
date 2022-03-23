import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

const REACT_APP_MAPBOX_TOKEN = 'pk.eyJ1IjoibGFyZW0iLCJhIjoiY2tydW56cmRvMWU2ZDJucWM5b3RkenlheSJ9._T-N-tweZoNEEjxnVxXLkA'
const REACT_APP_MAPBOX_STYLE = 'mapbox://styles/larem/ckrz30i6f0r9m17o10vtn2zu2'
mapboxgl.accessToken = REACT_APP_MAPBOX_TOKEN

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
      style: REACT_APP_MAPBOX_STYLE,
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

  return <div ref={mapContainer} className="map-container" />
}

export default Map
{
  /* <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div> */
}
