import { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Grid } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from '!mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { LayersCodes, LayersTypes } from 'components/Map/Layers'
import PropTypes from 'prop-types'
import { zoneTypes } from 'domain/zone'
import Popin from './Popin'
import { lineString, bbox } from '@turf/turf'
import { flattenDeep } from 'lodash'
import { useErrorHandler } from 'components/shared/error/hooks'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Map = styled(Grid)(
  ({ theme }) => `
  height: 85vh;
  margin: ${theme.spacing(1, 0, 2)};
  border-radius: 12px;
  border: 1px solid ${theme.palette.gray200}
`
)

const DTD_LAYER_POINT = LayersCodes.ciblagePapPoint
const DTD_LAYER_SHAPE = LayersCodes.ciblagePapShape

const DTDMap = ({ userZones }) => {
  const mapContainer = useRef(null)
  const map = useRef()
  const [currentPoint, setCurrentPoint] = useState(null)
  const [infos, setInfos] = useState(null)
  const popUpRef = useRef(new mapboxgl.Popup({ closeOnClick: true }))
  const { handleError } = useErrorHandler()

  const onMapReady = useCallback(() => {
    Object.keys(LayersTypes).map(key => {
      if (key === DTD_LAYER_POINT || key === DTD_LAYER_SHAPE) {
        map.current.setLayoutProperty(key, 'visibility', 'visible')
      } else {
        map.current.setLayoutProperty(key, 'visibility', 'none')
      }
    })

    const codesDepartement = userZones.filter(z => z.type === zoneTypes.DEPARTMENT).map(z => z.code)
    const codesRegion = userZones.filter(z => z.type === zoneTypes.REGION).map(z => z.code)
    const codesDistrict = userZones.filter(z => z.type === zoneTypes.DISTRICT).map(z => z.code)
    const codesCountry = userZones.filter(z => z.type === zoneTypes.COUNTRY).map(z => z.code)

    map.current.setFilter(DTD_LAYER_POINT, [
      'any',
      ['in', 'CODE_REGION', ...codesRegion],
      ['in', 'CODE_DEPARTMENT', ...codesDepartement],
      ['in', 'CODE_DISTRICT', ...codesDistrict],
      ['in', 'CODE_COUNTRY', ...codesCountry],
    ])

    map.current.setPaintProperty(DTD_LAYER_POINT, 'circle-color', ['coalesce', ['get', 'COLOR'], 'rgba(0,0,0,0)'])

    map.current.setFilter(DTD_LAYER_SHAPE, [
      'any',
      ['in', 'CODE_REGION', ...codesRegion],
      ['in', 'CODE_DEPARTMENT', ...codesDepartement],
      ['in', 'CODE_DISTRICT', ...codesDistrict],
      ['in', 'CODE_COUNTRY', ...codesCountry],
    ])
    map.current.setPaintProperty(DTD_LAYER_SHAPE, 'fill-color', ['coalesce', ['get', 'COLOR'], 'rgba(0,0,0,0)'])
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
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
    map.current.on('data', () => {
      const renderedFeatures = map.current.queryRenderedFeatures({
        layers: [DTD_LAYER_POINT],
      })

      if (renderedFeatures.length && map.current.getZoom() < 6) {
        try {
          const line = lineString(renderedFeatures.map(feature => flattenDeep(feature.geometry.coordinates)))
          map.current.fitBounds(bbox(line), { padding: 40 })
        } catch (e) {
          handleError(e)
        }
      }
    })
  }, [handleError])

  useEffect(() => {
    if (!map.current) return
    map.current.getCanvas().style.cursor = 'pointer'
    map.current.on('load', onMapReady)
    map.current.on('click', onClick)
  }, [map, onClick, onMapReady])

  useEffect(() => {
    if (!currentPoint) return
    const mapBoxProps = map.current.queryRenderedFeatures(currentPoint.point, {
      layers: [DTD_LAYER_POINT, DTD_LAYER_SHAPE],
    })
    if (mapBoxProps) {
      const [propsPoint] = mapBoxProps

      if (propsPoint) {
        const { properties: { CODE: code, ADDRESS: address, PRIORITY: priority } = {} } = propsPoint || {}
        setInfos({ code, address: address || '', priority })
      }
    }
  }, [map, currentPoint])

  useEffect(() => {
    if (!currentPoint || !infos) return
    const popupNode = document.createElement('div')

    ReactDOM.render(<Popin address={infos.address} code={infos.code} priority={infos.priority} />, popupNode)
    popUpRef.current
      .setLngLat(currentPoint.lngLat)
      .setDOMContent(popupNode)
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
      uuid: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
}

export default DTDMap
