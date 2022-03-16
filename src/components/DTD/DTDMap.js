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

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Map = styled(Grid)`
  height: 85vh;
  margin: ${({ theme }) => theme.spacing(1, 0, 2)};
  border-radius: 12px;
`

const DTD_LAYER_POINT = LayersCodes.ciblagePapPoint

const DTDMap = ({ userZones }) => {
  const mapContainer = useRef(null)
  const map = useRef()
  const [currentPoint, setCurrentPoint] = useState(null)
  const [infos, setInfos] = useState(null)
  const popUpRef = useRef(new mapboxgl.Popup({ closeOnClick: true }))
  const [hasFeatures, setHasFeatures] = useState(null)

  const onMapReady = useCallback(() => {
    Object.keys(LayersTypes).map(key => {
      map.current.setLayoutProperty(key, 'visibility', key === DTD_LAYER_POINT ? 'visible' : 'none')
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
      setHasFeatures(
        map.current.queryRenderedFeatures({
          layers: [DTD_LAYER_POINT],
        })
      )
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
    const mapBoxProps = map.current.queryRenderedFeatures(currentPoint.point, {
      layers: [DTD_LAYER_POINT],
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

  useEffect(() => {
    const bounds = new mapboxgl.LngLatBounds()

    if (hasFeatures?.length > 0) {
      hasFeatures.map(feature => {
        console.log(feature.geometry)
        bounds.extend(feature?.geometry?.coordinates)
      })

      map.current.fitBounds(bounds)
    }
  }, [hasFeatures])

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
