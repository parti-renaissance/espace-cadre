import mapboxgl from 'mapbox-gl'
import { MAPBOX_STYLE } from '~/shared/environments'

export function createMap(container, options = {}) {
  return new mapboxgl.Map({
    testMode: process.env.NODE_ENV === 'test',
    container: container,
    style: MAPBOX_STYLE,
    minZoom: 4,
    ...options,
  })
}
