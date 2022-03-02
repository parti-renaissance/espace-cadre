import { useCallback, useEffect, useRef, useState } from 'react'
import { Grid } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { LayersCodes, LayersTypes } from 'components/Map/Layers'
import PropTypes from 'prop-types'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Map = styled(Grid)`
  height: 85vh;
  margin: ${({ theme }) => theme.spacing(1, 0, 2)};
`

const DTD_LAYER = LayersCodes.ciblagePapShape
const DTDMap = ({ userZones }) => {
  const mapContainer = useRef(null)
  const map = useRef()
  const [currentPoint, setCurrentPoint] = useState(null)
  const [infos, setInfos] = useState(null)

  const onMapReady = useCallback(() => {
    Object.keys(LayersTypes).map(key => {
      map.current.setLayoutProperty(key, 'visibility', key === DTD_LAYER ? 'visible' : 'none')
    })
    const codesDepartement = userZones
      /*.filter(z => z.type === 'department')*/ // TODO: uncomment when zone's type is sent by backend
      .map(z => z.code)
    /*
      // TODO: uncomment when zone's type is sent by backend
      const codesRegion = userZones
      .filter(z => z.type === 'region')
      .map(z => z.code)
    */
    map.current.setFilter(DTD_LAYER, [
      'any',
      /*['in', 'CODE_REGION', ...codesRegion],*/ // TODO: uncomment when zone's type is sent by backend
      ['in', 'CODE_DEPARTMENT', ...codesDepartement],
    ])
    map.current.setPaintProperty(DTD_LAYER, 'fill-color', ['coalesce', ['get', 'COLOR'], 'rgba(0,0,0,0)'])
  }, [userZones])

  const onClick = useCallback(({ point, lngLat }) => {
    if (point) {
      setCurrentPoint({ point, lngLat })
    }
  }, [])

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE,
      minZoom: 4,
    })
  }, [])

  useEffect(() => {
    if (!map.current) return
    map.current.getCanvas().style.cursor = 'pointer'
    map.current.on('load', onMapReady)
    map.current.on('click', onClick)
  }, [map, onClick, onMapReady])

  useEffect(() => {
    if (!currentPoint) return
    const mapBoxProps = map.current.queryRenderedFeatures(currentPoint.point, { layers: [DTD_LAYER] })
    if (mapBoxProps) {
      const [props] = mapBoxProps
      if (props) {
        /**
         * TODO: get infos when available in mapbox tiles set
         * Nom et numéro du bureau de vote: ??
         * Priorité {x} : PRIORITY
         * L’adresse postale de ralliement : ??
         */
        const { properties: { PRIORITY: priority, CODE: code, COLOR: color } = {} } = props || {}
        setInfos({ priority, code, color })
      } else {
        setInfos(null)
      }
    }
  }, [map, currentPoint])

  useEffect(() => {
    if (!currentPoint || !infos) return
    new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(currentPoint.lngLat)
      .setHTML(`<h3>Bureau de Vote</h3><p>Priorité: ${infos.priority}</p>`)
      .addTo(map.current)
      .on('close', () => {
        setCurrentPoint(null)
        setInfos(null)
      })
  }, [currentPoint, infos])

  return <Map ref={mapContainer} />
}

DTDMap.propTypes = {
  userZones: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      code: PropTypes.string,
      name: PropTypes.string,
    })
  ),
}

export default DTDMap
