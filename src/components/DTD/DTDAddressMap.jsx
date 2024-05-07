import { useCallback, useEffect, useRef, useState } from 'react'
import { Grid, Box } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from 'mapbox-gl'

import PropTypes from 'prop-types'
import { lineString, bbox } from '@turf/turf'
import { flattenDeep } from 'lodash'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { MAPBOX_TOKEN } from '~/shared/environments'
import { createMap } from '~/providers/map'
import { UIChip } from '~/ui/Card'

mapboxgl.accessToken = MAPBOX_TOKEN

const Map = styled(Grid)(
  ({ theme }) => `
  height: 85vh;
  margin: ${theme.spacing(1, 0, 2)};
  border-radius: 12px;
  border: 1px solid ${theme.palette.gray200}
`
)

const BadgeCircle = styled('span')({
  display: 'inline-block',
  borderRadius: '50%',
  width: '10px',
  height: '10px',
})

const colors = ['#919EAB', '#FF462E', '#FF6A1A', '#FFC700']

const DTDAddressMap = ({ userZones }) => {
  const mapContainer = useRef(null)
  const [activePriority, setActivePriority] = useState(null)
  const map = useRef()
  const popup = useRef()
  const { handleError } = useErrorHandler()

  const zone = userZones[0]

  const getFilter = (zoneCode, activePriority = null) => {
    const filter = []

    if (zoneCode !== 'FR') {
      filter.push(['==', ['get', 'dpt'], zoneCode])
    }

    if (activePriority) {
      if (activePriority === -1) {
        filter.push(['!', ['has', 'score']])
      } else {
        filter.push([activePriority < 3 ? '==' : '>=', ['get', 'score'], activePriority])
      }
    }

    if (filter.length) {
      return ['all', ...filter]
    }

    return null
  }

  const handlePriorityChange = priority => {
    setActivePriority(priority)
    map.current.setFilter('layer-addresses', getFilter(zone.code, priority))
  }

  const onMapReady = useCallback(() => {
    const prio1 = ['==', ['get', 'score'], 1]
    const prio2 = ['==', ['get', 'score'], 2]
    const prio3 = ['>=', ['to-number', ['get', 'score']], 3]

    map.current.addSource('source-addresses', {
      type: 'vector',
      url: 'mapbox://larem.fr-addresses-v1',
    })

    const filter = getFilter(zone.code)

    map.current.addLayer(
      {
        id: 'layer-addresses',
        source: 'source-addresses',
        'source-layer': 'addresses',
        type: 'circle',
        ...(filter ? { filter } : {}),
        'circle-sort-key': ['case', ['has', 'score'], 100, 0],
        paint: {
          'circle-color': ['case', prio1, colors[1], prio2, colors[2], prio3, colors[3], colors[0]],
          'circle-opacity': ['case', ['has', 'score'], 1, 0.6],
        },
      },
      'road-label'
    )
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

      if (!Array.isArray(center) || center.length !== 2) {
        return
      }

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

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex' }} gap={1}>
          <UIChip
            label="Tout"
            color="#0369a1"
            bgcolor="#f0f9ff"
            sx={{ cursor: 'pointer' }}
            onClick={() => handlePriorityChange(null)}
          />
          <UIChip
            label={
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }} gap={0.5}>
                <BadgeCircle sx={{ backgroundColor: colors[1] }} /> Priorité 1
              </Box>
            }
            onClick={() => handlePriorityChange(1)}
            color="#0369a1"
            bgcolor="#f0f9ff"
            sx={{ cursor: 'pointer' }}
          />
          <UIChip
            label={
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }} gap={0.5}>
                <BadgeCircle sx={{ backgroundColor: colors[2] }} /> Priorité 2
              </Box>
            }
            onClick={() => handlePriorityChange(2)}
            color="#0369a1"
            bgcolor="#f0f9ff"
            sx={{ cursor: 'pointer' }}
          />
          <UIChip
            label={
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }} gap={0.5}>
                <BadgeCircle sx={{ backgroundColor: colors[3] }} /> Priorité 3
              </Box>
            }
            onClick={() => handlePriorityChange(3)}
            color="#0369a1"
            bgcolor="#f0f9ff"
            sx={{ cursor: 'pointer' }}
          />
          <UIChip
            label={
              <Box component="span" sx={{ display: 'flex', alignItems: 'center' }} gap={0.5}>
                <BadgeCircle sx={{ backgroundColor: colors[0] }} /> Non prioritaire
              </Box>
            }
            onClick={() => handlePriorityChange(-1)}
            color="#0369a1"
            bgcolor="#f0f9ff"
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Map ref={mapContainer} />
      </Grid>
    </Grid>
  )
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
