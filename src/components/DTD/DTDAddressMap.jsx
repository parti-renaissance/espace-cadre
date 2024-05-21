import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Grid } from '@mui/material'
import { styled } from '@mui/system'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import PropTypes from 'prop-types'
import { bbox, lineString } from '@turf/turf'
import { flattenDeep } from 'lodash'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { MAPBOX_TOKEN } from '~/shared/environments'
import { createMap } from '~/providers/map'
import { UIChip } from '~/ui/Card'
import { Scope } from '~/domain/scope'
import { DPI, Format, MapboxExportControl, PageOrientation, Size } from '@watergis/mapbox-gl-export'
import '@watergis/mapbox-gl-export/dist/mapbox-gl-export.css'

mapboxgl.accessToken = MAPBOX_TOKEN

const Map = styled(Grid)(
  ({ theme }) => `
  height: 85vh;
  margin: ${theme.spacing(1, 0, 2)};
  border-radius: 12px;
  border: 1px solid ${theme.palette.gray200};
`
)

const BadgeCircle = styled('span')({
  display: 'inline-block',
  borderRadius: '50%',
  width: '10px',
  height: '10px',
})

const colors = ['#919EAB', '#EF000E', '#FF912B', '#FFC90A', '#29A6FF']

const filterButtons = [
  {
    label: 'Tout',
    value: null,
  },
  {
    label: 'Priorité 1',
    value: 1,
    badge: colors[1],
  },
  {
    label: 'Priorité 2',
    value: 2,
    badge: colors[2],
  },
  {
    label: 'Priorité 3',
    value: 3,
    badge: colors[3],
  },
  {
    label: 'IP',
    value: 100,
    badge: colors[4],
  },
  {
    label: 'Non prioritaire',
    value: -1,
    badge: colors[0],
  },
]

const DTDAddressMap = ({ userScope }) => {
  const mapContainer = useRef(null)
  const [activePriority, setActivePriority] = useState(null)
  /** @type {React.MutableRefObject<mapboxgl.Map>} */
  const map = useRef()
  /** @type {React.MutableRefObject<maxboxgl.Popup>} */
  const popup = useRef()
  const { handleError } = useErrorHandler()

  const zoneCode = userScope.isAnimator() ? userScope.getAttributes()?.dpt : userScope.zones[0].code
  const isNational = userScope.isNational()

  const getFilter = (zoneCode, activePriority = null) => {
    const filter = []

    if (zoneCode !== 'FR') {
      filter.push(['==', ['get', 'dpt'], zoneCode.substring(0, 2)])
    }

    if (activePriority) {
      if (activePriority === -1) {
        filter.push(['all', ['!', ['has', 'score']], ...(isNational ? [['!', ['has', 'ip_score']]] : [])])
      } else if (activePriority === 100 && isNational) {
        filter.push(['has', 'ip_score'])
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
    map.current.setFilter('layer-addresses', getFilter(zoneCode, priority))
  }

  const onMapReady = useCallback(() => {
    const ipPoint = ['has', 'ip_score']
    const prio1 = ['==', ['get', 'score'], 1]
    const prio2 = ['==', ['get', 'score'], 2]
    const prio3 = ['>=', ['to-number', ['get', 'score']], 3]

    map.current.addSource('source-addresses', {
      type: 'vector',
      url: 'mapbox://larem.fr-addresses-v2-bis',
    })

    const filter = getFilter(zoneCode)

    map.current.addLayer(
      {
        id: 'layer-addresses',
        source: 'source-addresses',
        'source-layer': 'addresses',
        type: 'circle',
        ...(filter ? { filter } : {}),
        'circle-sort-key': ['case', ['has', 'score'], 100, ['has', 'ip_score'], 100, 0],
        paint: {
          'circle-color': [
            'case',
            ...(isNational ? [ipPoint, colors[4]] : []),
            prio1,
            colors[1],
            prio2,
            colors[2],
            prio3,
            colors[3],
            colors[0],
          ],
          'circle-opacity': ['case', ['has', 'score'], 1, ...(isNational ? [['has', 'ip_score'], 1] : []), 0.6],
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 1,
        },
      },
      'road-label'
    )

    map.current.addControl(
      new MapboxExportControl({
        PageSize: Size.A4,
        PageOrientation: PageOrientation.Portrait,
        Format: Format.PDF,
        DPI: DPI[300],
        Crosshair: false,
        PrintableArea: true,
        Local: 'fr',
        accessToken: MAPBOX_TOKEN,
        attributionStyle: { textSize: 0 },
        Filename: 'renaissance-export-porte-a-porte',
      }),
      'top-right'
    )
  }, [zoneCode])

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
          {filterButtons
            .filter(filter => isNational || filter.value !== 100)
            .map(({ label, value, badge }) => (
              <UIChip
                key={label}
                label={
                  badge ? (
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }} gap={0.5}>
                      <BadgeCircle sx={{ backgroundColor: badge }} /> {label}
                    </Box>
                  ) : (
                    label
                  )
                }
                color="#0369a1"
                bgcolor={activePriority === value ? '#f0f9ff' : '#fff'}
                sx={{ cursor: 'pointer' }}
                onClick={() => handlePriorityChange(value)}
              />
            ))}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Map ref={mapContainer} />
      </Grid>
    </Grid>
  )
}

DTDAddressMap.propTypes = {
  userScope: PropTypes.objectOf(Scope).isRequired,
}

export default DTDAddressMap
