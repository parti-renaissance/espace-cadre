import mapboxgl from 'mapbox-gl'
import { MAPBOX_STYLE } from '~/shared/environments'

/**
 *
 * @param container
 * @param options
 * @returns {mapboxgl.Map}
 */
export function createMap(container, options = {}) {
  return new mapboxgl.Map({
    container: container,
    style: MAPBOX_STYLE,
    antialias: true,
    locale: 'fr',
    minZoom: 4,
    attributionControl: false,
    ...options,
  })
}
