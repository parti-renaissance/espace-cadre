/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from '!mapbox-gl'
import { styled } from '@mui/system'
import { Grid } from '@mui/material'
import { lineString, bbox } from '@turf/turf'
import { flattenDeep } from 'lodash'
import { zoneTypes } from 'domain/zone'
import MapContext from './MapContext'
import { useUserScope } from '../../redux/user/hooks'
import { uniqWith } from 'lodash/array'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Container = styled(Grid)`
  border-radius: 12px;
`
const featuresFilter = (codesRegion, codesDepartement, codesDistrict, codesCountry) => [
  'any',
  ['in', 'CODE_REGION', ...codesRegion],
  ['in', 'CODE_DEPARTMENT', ...codesDepartement],
  ['in', 'CODE_DISTRICT', ...codesDistrict],
  ['in', 'CODE_COUNTRY', ...codesCountry],
]

const SOURCE_ID = 'voting-places'
const SOURCE_LAYER = 'ciblage_legislatives'
const MAIN_LAYER_ID = 'main-layer'
const LINE_LAYER_ID = 'line-layer'
const MAIN_LINE_LAYER_ID = 'main-line-layer'

const messages = {
  warning: "Cette carte n'est pas cliquable. Elle le sera à l'étape suivante.",
  title: 'Bureaux de vote',
  address: 'Adresse',
}

function Map({ currentStep }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const { setPollingStationSelection, pollingStationSelection } = useContext(MapContext)
  const [userScope] = useUserScope()
  const userZones = userScope.zones

  const center =
    userZones[0].longitude && userZones[0].latitude ? [userZones[0].longitude, userZones[0].latitude] : null

  const codesDepartement = userZones.filter(z => z.type === zoneTypes.DEPARTMENT).map(z => z.code)
  const codesRegion = userZones.filter(z => z.type === zoneTypes.REGION).map(z => z.code)
  const codesDistrict = userZones.filter(z => z.type === zoneTypes.DISTRICT).map(z => z.code)
  const codesCountry = userZones.filter(z => z.type === zoneTypes.COUNTRY).map(z => z.code)

  const codes = [codesRegion, codesDepartement, codesDistrict, codesCountry]

  const handleMapClick = e => {
    if (currentStep < 2) {
      return
    }
    const features = map.current.queryRenderedFeatures(e.point, { layers: [MAIN_LAYER_ID] })

    if (features.length) {
      const code = features[0].properties.CODE

      if (pollingStationSelection.includes(code)) {
        setPollingStationSelection(pollingStationSelection.filter(item => item !== code))
      } else {
        setPollingStationSelection([...pollingStationSelection, code])
      }
    }
  }

  const handleMapClickRef = useRef(handleMapClick)
  handleMapClickRef.current = handleMapClick

  useEffect(() => {
    if (map.current) {
      return
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_MAPBOX_STYLE,
      ...(center ? { center, zoom: 8 } : {}),
      minZoom: 4,
    })

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
        },
      })

      map.current.addLayer({
        id: MAIN_LINE_LAYER_ID,
        source: SOURCE_ID,
        'source-layer': SOURCE_LAYER,
        filter: featuresFilter(...codes),
        type: 'line',
        paint: {
          'line-color': '#D3D3D3',
          'line-opacity': 0.5,
          'line-width': 1,
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
          'line-width': 3,
        },
      })
    })

    map.current.on('data', () => {
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

    map.current.on('click', MAIN_LAYER_ID, e => {
      handleMapClickRef.current(e)
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
        { active: pollingStationSelection.includes(feature.properties.CODE) }
      )
    })
  }, [pollingStationSelection])

  return (
    <Container ref={mapContainer} className={currentStep === 0 ? 'map-container-intro' : 'map-container'}>
      {currentStep === 1 && (
        <div className="infobar">
          <span>{messages.warning}</span>
        </div>
      )}
    </Container>
  )
}

Map.propTypes = {
  currentStep: PropTypes.number,
}

export default Map
