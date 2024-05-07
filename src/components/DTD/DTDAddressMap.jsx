import { useCallback, useEffect, useRef } from 'react'
import { Grid } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from 'mapbox-gl'

import PropTypes from 'prop-types'
import { lineString, bbox } from '@turf/turf'
import { flattenDeep } from 'lodash'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { MAPBOX_TOKEN } from '~/shared/environments'
import { createMap } from '~/providers/map'

mapboxgl.accessToken = MAPBOX_TOKEN

const Map = styled(Grid)(
  ({ theme }) => `
  height: 85vh;
  margin: ${theme.spacing(1, 0, 2)};
  border-radius: 12px;
  border: 1px solid ${theme.palette.gray200}
`
)

const DTDAddressMap = ({ userZones }) => {
  const mapContainer = useRef(null)
  const map = useRef()
  const popup = useRef()
  const { handleError } = useErrorHandler()

  const zone = userZones[0]

  const onMapReady = useCallback(() => {
    const prio1 = ['==', ['get', 'score'], 1]
    const prio2 = ['==', ['get', 'score'], 2]
    const prio3 = ['==', ['get', 'score'], 3]
    const prio4 = ['==', ['get', 'score'], 4]
    const prio5 = ['==', ['get', 'score'], 5]

    // colors to use for the categories
    const colors = ['#ccc', '#e31a1c', '#fc4e2a', '#fd8d3c', '#feb24c', '#fed976']

    map.current.addSource('source-addresses', {
      type: 'vector',
      url: 'mapbox://larem.fr-addresses-v1',
    })

    map.current.addLayer({
      id: 'layer-addresses',
      source: 'source-addresses',
      'source-layer': 'addresses',
      type: 'circle',
      ...(zone.code !== 'FR' ? { filter: ['==', ['get', 'dpt'], zone.code] } : {}),
      'circle-sort-key': ['*', -1, ['number', ['get', 'score'], 10]],
      paint: {
        'circle-color': [
          'case',
          prio1,
          colors[1],
          prio2,
          colors[2],
          prio3,
          colors[3],
          prio4,
          colors[4],
          prio5,
          colors[5],
          colors[0],
        ],
        'circle-opacity': ['case', ['has', 'score'], 1, 0.5],
      },
    })
  }, [zone])

  useEffect(() => {
    map.current = createMap(mapContainer.current)
    popup.current = new mapboxgl.Popup({ closeOnMove: true })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left')

    map.current.on('data', () => {
      if (!map.current.getLayer('layer-addresses')) {
        return
      }

      const renderedFeatures = map.current.queryRenderedFeatures({
        layers: ['layer-addresses'],
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

    map.current.on('mousemove', 'layer-addresses', ({ point }) => {
      const features = map.current.queryRenderedFeatures(point)

      if (!features.length) {
        return
      }

      const center = features[0].geometry.coordinates

      const properties = features[0].properties
      const address = [properties.address, properties.postal_codes, properties.city_name].filter(Boolean)

      popup.current
        .setLngLat(center)
        .setHTML('<div>Adresse :</div><div>' + address.join('<br/>') + '</div>')
        .addTo(map.current)
    })
  }, [handleError])

  useEffect(() => {
    if (!map.current) {
      return
    }

    map.current.getCanvas().style.cursor = 'pointer'
    map.current.on('load', onMapReady)
  }, [map, onMapReady])

  return <Map ref={mapContainer} />
}

DTDAddressMap.propTypes = {
  userZones: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
}

export default DTDAddressMap
