import { useCallback, useEffect, useRef } from 'react'
import { Grid } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

import { LayersTypes } from 'components/Map/Layers'
import PropTypes from 'prop-types'
import { zoneTypes } from 'domain/zone'
import { lineString, bbox } from '@turf/turf'
import { flattenDeep } from 'lodash'
import { useErrorHandler } from 'components/shared/error/hooks'
import { MAPBOX_TOKEN } from 'shared/environments'
import { createMap } from 'providers/map'

mapboxgl.accessToken = MAPBOX_TOKEN

const Map = styled(Grid)(
  ({ theme }) => `
  height: 85vh;
  margin: ${theme.spacing(1, 0, 2)};
  border-radius: 12px;
  border: 1px solid ${theme.palette.gray200}
`
)

const DTDMap = ({ userZones, typeOfLayer }) => {
  const mapContainer = useRef(null)
  const map = useRef()
  const { handleError } = useErrorHandler()

  const onMapReady = useCallback(() => {
    Object.keys(LayersTypes).map(key => {
      map.current.setLayoutProperty(key, 'visibility', key === typeOfLayer ? 'visible' : 'none')
    })

    const codesDepartement = userZones.filter(z => z.type === zoneTypes.DEPARTMENT).map(z => z.code)
    const codesRegion = userZones.filter(z => z.type === zoneTypes.REGION).map(z => z.code)
    const codesDistrict = userZones.filter(z => z.type === zoneTypes.DISTRICT).map(z => z.code)
    const codesCountry = userZones.filter(z => z.type === zoneTypes.COUNTRY).map(z => z.code)

    map.current.setFilter(typeOfLayer, [
      'any',
      ['in', 'CODE_REGION', ...codesRegion],
      ['in', 'CODE_DEPARTMENT', ...codesDepartement],
      ['in', 'CODE_DISTRICT', ...codesDistrict],
      ['in', 'CODE_COUNTRY', ...codesCountry],
    ])

    map.current.setPaintProperty(typeOfLayer, 'circle-color', ['coalesce', ['get', 'COLOR'], 'rgba(0,0,0,0)'])
  }, [userZones, typeOfLayer])

  useEffect(() => {
    map.current = createMap(mapContainer.current)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')
    map.current.on('data', () => {
      const renderedFeatures = map.current.queryRenderedFeatures({
        layers: [typeOfLayer],
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
  }, [handleError, typeOfLayer])

  useEffect(() => {
    if (!map.current) {
      return
    }
    map.current.getCanvas().style.cursor = 'pointer'
    map.current.on('load', onMapReady)
  }, [map, onMapReady])

  return <Map ref={mapContainer} />
}

DTDMap.propTypes = {
  typeOfLayer: PropTypes.string,
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
