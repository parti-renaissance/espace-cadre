import { useRef, useEffect, createContext, useContext, useMemo, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { styled } from '@mui/system'
import { Grid } from '@mui/material'
import { lineString, bbox } from '@turf/turf'
import { flattenDeep, uniqWith } from 'lodash'
import { getUsedZones } from 'api/committees'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { committeeZones } from 'components/Committees/constants'
import { useErrorHandler } from 'components/shared/error/hooks'
import { zoneTypes } from 'domain/zone'
import { MAPBOX_TOKEN } from 'shared/environments'
import { createMap } from 'providers/map'
import { useUserScope } from '../../redux/user/hooks'

export const MapContext = createContext()

mapboxgl.accessToken = MAPBOX_TOKEN

const Container = styled(Grid)`
  border-radius: 12px;
  height: 100%;
  width: 100%;
  min-height: 650px;
`

const defaultLayerOption = dptCodes => ({
  type: 'line',
  filter: ['in', ['get', 'dpt'], ['literal', dptCodes]],
  paint: {
    'line-color': '#565656',
    'line-opacity': 0.25,
    'line-width': 0.5,
  },
})

const filledLayerOption = zoneCodes => ({
  type: 'fill',
  filter: ['in', ['get', 'dpt'], ['literal', zoneCodes]],
  paint: {
    'fill-color': ['coalesce', ['feature-state', 'color'], 'rgba(0,0,0,0)'],
    'fill-outline-color': '#565656',
  },
})

const aggregateZonesByType = zones => {
  const zonesByTypes = {}

  for (const zone of zones) {
    if (typeof zonesByTypes[zone.type] === 'undefined') {
      zonesByTypes[zone.type] = []
    }
    zonesByTypes[zone.type].push(zone.code)
  }

  return zonesByTypes
}

const MAP_SOURCES = {
  [zoneTypes.VOTE_PLACE]: 'mapbox://larem.1bbbj2b2',
  [zoneTypes.BOROUGH]: 'mapbox://larem.0mxjf8sw',
  [zoneTypes.CANTON]: 'mapbox://larem.dcl6d90t',
  [zoneTypes.CITY]: 'mapbox://larem.6hmep1lo',
  [zoneTypes.CITY_COMMUNITY]: 'mapbox://larem.9xnlykmn',
}

const Map = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [mapLayersLoaded, setMapLayersLoaded] = useState(false)

  const { zones } = useContext(MapContext)
  const { handleError } = useErrorHandler()
  const [userScope] = useUserScope()
  const userZones = userScope.zones

  const { data: usedZones = [] } = useQueryWithScope(
    ['used-zones', { feature: 'Committees', view: 'Committees' }],
    getUsedZones,
    {
      onError: handleError,
    }
  )

  const dptCodes = userZones.filter(z => z.type === zoneTypes.DEPARTMENT).map(z => z.code)
  if (!dptCodes.length) {
    dptCodes.concat(
      userZones
        .filter(z => [zoneTypes.CITY, zoneTypes.BOROUGH, zoneTypes.DISTRICT, zoneTypes.CANTON].includes(z.type))
        .map(z => z.code)
        .map(code => code.substring(0, 2))
    )
  }

  const center = useMemo(
    () => (userZones[0].longitude && userZones[0].latitude ? [userZones[0].longitude, userZones[0].latitude] : null),
    [userZones]
  )

  const zoneCodesByTypes = useMemo(() => aggregateZonesByType(zones), [zones])
  const usedZoneCodesByTypes = useMemo(() => aggregateZonesByType(usedZones), [usedZones])

  useEffect(() => {
    if (map.current) {
      return
    }

    map.current = createMap(mapContainer.current, { ...(center ? { center, zoom: 8 } : {}) })

    map.current.on('load', () => {
      // Load all sources
      map.current.addSource(zoneTypes.DEPARTMENT, { type: 'vector', url: 'mapbox://larem.8tm42bsz' }).addLayer({
        id: `${zoneTypes.DEPARTMENT}_layer_fill`,
        source: zoneTypes.DEPARTMENT,
        'source-layer': zoneTypes.DEPARTMENT,
        type: 'fill',
        filter: ['in', ['get', 'code'], ['literal', dptCodes]],
        paint: {
          'fill-color': '#f00',
          'fill-opacity': 0.25,
          'fill-outline-color': '#000',
        },
      })

      committeeZones.map(zoneType => map.current.addSource(zoneType, { type: 'vector', url: MAP_SOURCES[zoneType] }))

      committeeZones.map(zoneType => {
        map.current.addLayer({
          id: `${zoneType}_layer_line`,
          source: zoneType,
          'source-layer': zoneType,
          ...defaultLayerOption(dptCodes),
        })

        map.current.addLayer({
          id: `${zoneType}_layer_fill`,
          source: zoneType,
          'source-layer': zoneType,
          ...filledLayerOption(dptCodes),
        })
      })

      map.current.on('idle', () => {
        setMapLayersLoaded(true)
      })
    })

    let zoomed = false
    let onFly = false

    map.current
      .once('click', () => (zoomed = true))
      .once('dbclick', () => (zoomed = true))
      .once('wheel', () => (zoomed = true))
      .on('data', () => {
        if (onFly || zoomed || 'undefined' === typeof map.current.getLayer('department_layer_fill')) {
          return
        }

        const renderedFeatures = map.current.queryRenderedFeatures({
          layers: ['department_layer_fill'],
          validate: false,
        })

        if (renderedFeatures.length >= 2) {
          onFly = true

          const line = lineString(renderedFeatures.map(feature => flattenDeep(feature.geometry.coordinates)))
          map.current.fitBounds(bbox(line), { maxZoom: 9 })
        }
      })
  }, [map, center, dptCodes, mapLayersLoaded])

  useEffect(() => {
    if (!map.current || !mapLayersLoaded) {
      return
    }

    const chooseColor = (code, zoneCurrentCommittee, usedZones) => {
      if (zoneCurrentCommittee.includes(code)) {
        return '#22c55e'
      }

      if (usedZones.includes(code)) {
        return '#bbf7d0'
      }

      return 'rgba(0,0,0, 0)'
    }

    committeeZones.map(zoneType => {
      const features = uniqWith(
        map.current.querySourceFeatures(zoneType, {
          sourceLayer: `${zoneType}`,
          filter: ['in', ['get', 'dpt'], ['literal', dptCodes]],
          validate: false,
        }),
        (a, b) => a.id === b.id
      )

      features.forEach(feature => {
        map.current.setFeatureState(
          {
            source: zoneType,
            sourceLayer: `${zoneType}`,
            id: feature.id,
          },
          {
            color: chooseColor(
              feature.properties.code,
              zoneCodesByTypes[zoneType] || [],
              usedZoneCodesByTypes[zoneType] || []
            ),
          }
        )
      })
    })
  }, [map, zoneCodesByTypes, usedZoneCodesByTypes, mapLayersLoaded, dptCodes])
  return <Container ref={mapContainer} />
}

export default Map
