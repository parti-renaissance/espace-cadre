/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from '!mapbox-gl'
import { styled } from '@mui/system'
import { Grid } from '@mui/material'
import { lineString, bbox } from '@turf/turf'
import { flattenDeep } from 'lodash'
import { LayersCodes } from 'components/Map/Layers'
import { useErrorHandler } from 'components/shared/error/hooks'
import { zoneTypes } from 'domain/zone'
import MapContext from './MapContext'
import { useUserScope } from '../../redux/user/hooks'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Container = styled(Grid)`
  border-radius: 12px;
`

function Map({ currentStep }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [currentPoint, setCurrentPoint] = useState()
  const [pollingStation, setPollingStation] = useState(null)
  const { setPollingStationSelection, pollingStationSelection } = useContext(MapContext)
  const [userScope] = useUserScope()
  const { handleError } = useErrorHandler()
  const userZones = userScope.zones

  const shouldShowMapInfobar = currentStep === 1 || pollingStation

  const handleCurrentPoint = useCallback(({ point, lngLat }) => {
    if (!point || !lngLat) return
    setCurrentPoint({ point, lngLat })
  }, [])

  const getMapBoxProperties = mapBoxProps => {
    const properties = mapBoxProps[0].properties
    const coordinates = mapBoxProps[0].geometry.coordinates
    return { properties, coordinates }
  }

  const getCoordinates = code => {
    const renderedFeatures = map.current.queryRenderedFeatures(null, {
      layers: [LayersCodes.pollingStationLegislatives],
    })
    let coordinates = []
    renderedFeatures.forEach(element => {
      if (element.properties.CODE === code) {
        coordinates = element.geometry.coordinates
      }
    })
    return coordinates
  }

  const highlightSelectedPolygon = (coordinates, id) => {
    const selection = map.current.getSource(id)
    if (selection) {
      map.current.removeLayer(`${id}_outline`)
      map.current.removeLayer(id)
      map.current.removeSource(id)
      return
    }
    map.current.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates,
        },
      },
    })

    map.current.addLayer({
      id,
      type: 'fill',
      source: id,
      layout: {},
      paint: {
        'fill-color': '#0080ff',
        'fill-opacity': 0.5,
      },
    })

    map.current.addLayer({
      id: `${id}_outline`,
      type: 'line',
      source: id,
      layout: {},
      paint: {
        'line-color': '#000',
        'line-width': 3,
      },
    })
  }

  const messages = {
    warning: "Cette carte n'est pas cliquable. Elle le sera à l'étape suivante.",
    title: 'Bureaux de vote',
    address: 'Adresse',
  }

  const codesDepartement = userZones.filter(z => z.type === zoneTypes.DEPARTMENT).map(z => z.code)
  const codesRegion = userZones.filter(z => z.type === zoneTypes.REGION).map(z => z.code)
  const codesDistrict = userZones.filter(z => z.type === zoneTypes.DISTRICT).map(z => z.code)
  const codesCountry = userZones.filter(z => z.type === zoneTypes.COUNTRY).map(z => z.code)

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE,
      minZoom: 4,
    })
  })

  useEffect(() => {
    if (!map.current) return
    map.current.getCanvas().style.cursor = 'pointer'
    map.current.on('data', () => {
      const renderedFeatures = map.current.queryRenderedFeatures({
        layers: [LayersCodes.pollingStationLegislatives],
      })

      if (renderedFeatures.length && map.current.getZoom() < 6) {
        try {
          const line = lineString(renderedFeatures.map(feature => flattenDeep(feature.geometry.coordinates)))
          map.current.fitBounds(bbox(line), { padding: 140 })
        } catch (e) {
          handleError(e)
        }
      }
    })
    map.current.on('load', () => setMapLoaded(true))
    map.current.on('click', handleCurrentPoint)
  }, [map, handleCurrentPoint])

  useEffect(() => {
    if (!mapLoaded) return
    map.current.setLayoutProperty(LayersCodes.pollingStationLegislatives, 'visibility', 'visible')
    map.current.setFilter(LayersCodes.pollingStationLegislatives, [
      'any',
      ['in', 'CODE_REGION', ...codesRegion],
      ['in', 'CODE_DEPARTMENT', ...codesDepartement],
      ['in', 'CODE_DISTRICT', ...codesDistrict],
      ['in', 'CODE_COUNTRY', ...codesCountry],
    ])
    map.current.setPaintProperty(LayersCodes.pollingStationLegislatives, 'fill-color', [
      'coalesce',
      ['get', 'COLOR'],
      'rgba(0,0,0,0)',
    ])
  }, [mapLoaded])

  useEffect(() => {
    if (!mapLoaded || !currentPoint) return

    const mapBoxProps = map.current.queryRenderedFeatures(currentPoint.point, {
      layers: [LayersCodes.pollingStationLegislatives],
    })
    if (!mapBoxProps[0]) return
    if (currentStep === 1) return

    const { CODE, ADDRESS } = getMapBoxProperties(mapBoxProps).properties
    if (CODE && ADDRESS) setPollingStation({ CODE, ADDRESS })
    const currentPolygonCoordinates = getMapBoxProperties(mapBoxProps).coordinates
    highlightSelectedPolygon(currentPolygonCoordinates, CODE)
    setPollingStationSelection({ code: CODE, trigger: 'map' })
  }, [mapLoaded, currentPoint, map, currentStep])

  useEffect(() => {
    if (pollingStationSelection && pollingStationSelection.trigger === 'list') {
      if (pollingStationSelection.codeList && pollingStationSelection.codeList.length > 0) {
        pollingStationSelection.codeList.forEach(code => {
          const currentPolygonCoordinates = getCoordinates(code)
          highlightSelectedPolygon(currentPolygonCoordinates, code)
        })
      } else {
        const currentPolygonCoordinates = getCoordinates(pollingStationSelection.code)
        highlightSelectedPolygon(currentPolygonCoordinates, pollingStationSelection.code)
      }
    }
  }, [pollingStationSelection])

  return (
    <Container ref={mapContainer} className="map-container">
      {shouldShowMapInfobar && (
        <div className="infobar">
          {currentStep === 1 && <span>{messages.warning}</span>}
          {currentStep === 2 && (
            <span>{`${messages.title}: ${pollingStation.CODE} | ${messages.address}: ${pollingStation.ADDRESS}`}</span>
          )}
        </div>
      )}
    </Container>
  )
}

Map.propTypes = {
  currentStep: PropTypes.number,
}

export default Map
