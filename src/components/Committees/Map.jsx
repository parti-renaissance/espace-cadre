import { useRef, useEffect, createContext, useContext, useMemo } from 'react'
import mapboxgl from 'mapbox-gl'
import { styled } from '@mui/system'
import { Grid } from '@mui/material'
import { lineString, bbox } from '@turf/turf'
import { flattenDeep } from 'lodash'
import { zoneTypes } from 'domain/zone'
import { useUserScope } from '../../redux/user/hooks'
import { uniqWith } from 'lodash/array'
import { MAPBOX_TOKEN } from 'shared/environments'
import { createMap } from 'providers/map'

export const MapContext = createContext()

mapboxgl.accessToken = MAPBOX_TOKEN

const Container = styled(Grid)`
  border-radius: 12px;
  height: 100%;
  width: 100%;
  min-height: 650px;
`

const featuresFilter = (codesRegion, codesCountry) => [
  'any',
  ['in', 'CODE_REGION', ...codesRegion],
  ['in', 'CODE_COUNTRY', ...codesCountry],
]

const SOURCE_ID = 'voting-places'
const SOURCE_LAYER = 'ciblage_legislatives'
const MAIN_LAYER_ID = 'main-layer'
const LINE_LAYER_ID = 'line-layer'

const Map = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const { zones, setZones } = useContext(MapContext)
  const [userScope] = useUserScope()
  const userZones = userScope.zones

  const center =
    userZones[0].longitude && userZones[0].latitude ? [userZones[0].longitude, userZones[0].latitude] : null
  const codesRegion = userZones.filter(z => z.type === zoneTypes.REGION).map(z => z.code)
  const codesCountry = userZones.filter(z => z.type === zoneTypes.COUNTRY).map(z => z.code)

  const codes = useMemo(() => [codesRegion, codesCountry], [codesRegion, codesCountry])

  const handleMapClick = e => {
    const features = map.current.queryRenderedFeatures(e.point, { layers: [MAIN_LAYER_ID] })

    if (features.length) {
      const code = features[0].properties.CODE

      if (zones.includes(code)) {
        setZones(zones.filter(item => item !== code))
      } else {
        setZones([...zones, code])
      }
    }
  }

  const handleMapClickRef = useRef(handleMapClick)
  handleMapClickRef.current = handleMapClick

  useEffect(() => {
    if (map.current) {
      return
    }

    map.current = createMap(mapContainer.current, { ...(center ? { center, zoom: 8 } : {}) })

    map.current.getCanvas().style.cursor = 'pointer'

    map.current.on('load', () => {
      map.current.addSource(SOURCE_ID, {
        type: 'vector',
        url: 'mapbox://larem.dp5yhkm6',
      })

      map.current.addLayer({
        id: MAIN_LAYER_ID,
        source: SOURCE_ID,
        'source-layer': SOURCE_LAYER,
        filter: featuresFilter(...codes),
        type: 'fill',
        paint: {
          'fill-color': ['coalesce', ['get', 'COLOR'], 'rgba(0,0,0,0)'],
          'fill-opacity': 0.25,
          'fill-outline-color': '#565656',
        },
      })

      map.current.addLayer({
        id: LINE_LAYER_ID,
        source: SOURCE_ID,
        'source-layer': SOURCE_LAYER,
        type: 'line',
        paint: {
          'line-color': '#000',
          'line-opacity': ['case', ['boolean', ['feature-state', 'active'], false], 1, 0],
          'line-width': 2,
        },
      })
    })

    let zoomed = false

    map.current
      .once('click', () => (zoomed = true))
      .once('dbclick', () => (zoomed = true))
      .once('wheel', () => (zoomed = true))
      .on('click', MAIN_LAYER_ID, e => handleMapClickRef.current(e))
      .on('data', () => {
        if (zoomed) {
          return
        }

        const renderedFeatures = map.current.querySourceFeatures(SOURCE_ID, {
          filter: featuresFilter(...codes),
          sourceLayer: SOURCE_LAYER,
          validate: false,
        })

        if (!center && renderedFeatures.length === 0 && map.current.getZoom !== 7) {
          map.current.zoomTo(7, { duration: 100 })
        }

        if (renderedFeatures.length >= 2) {
          const line = lineString(renderedFeatures.map(feature => flattenDeep(feature.geometry.coordinates)))
          map.current.fitBounds(bbox(line), { padding: 140 })
        }
      })
  })

  useEffect(() => {
    const features = uniqWith(
      map.current.querySourceFeatures(SOURCE_ID, {
        sourceLayer: SOURCE_LAYER,
        filter: featuresFilter(...codes),
        validate: false,
      }),
      (a, b) => a.id === b.id
    )

    features.forEach(feature => {
      map.current.setFeatureState(
        {
          source: SOURCE_ID,
          sourceLayer: SOURCE_LAYER,
          id: feature.id,
        },
        { active: zones.includes(feature.properties.CODE) }
      )
    })
  }, [zones, codes])

  return <Container ref={mapContainer} />
}

export default Map
