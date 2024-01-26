import PropTypes from 'prop-types'

export class Zone {
  constructor(id, name, code) {
    this.id = id
    this.name = name
    this.code = code
  }
  static propTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  })
}

export const zoneTypes = {
  COUNTRY: 'country',
  CUSTOM: 'custom',
  REGION: 'region',
  DEPARTMENT: 'department',
  DISTRICT: 'district',
  CITY: 'city',
  BOROUGH: 'borough',
  CITY_COMMUNITY: 'city_community',
  CANTON: 'canton',
  FOREIGN_DISTRICT: 'foreign_district',
  CONSULAR_DISTRICT: 'consular_district',
  VOTE_PLACE: 'vote_place',
}

export const zoneLabels = {
  [zoneTypes.COUNTRY]: 'Pays',
  [zoneTypes.CITY_COMMUNITY]: 'Communauté de commune',
  [zoneTypes.CITY]: 'Commune',
  [zoneTypes.CANTON]: 'Canton',
  [zoneTypes.DEPARTMENT]: 'Département',
  [zoneTypes.DISTRICT]: 'Circonscription',
  [zoneTypes.BOROUGH]: 'Arrondissement',
  [zoneTypes.FOREIGN_DISTRICT]: 'Circonscription FDE',
  [zoneTypes.CONSULAR_DISTRICT]: 'Circonscription consulaire',
  [zoneTypes.VOTE_PLACE]: 'Bureau de vote',
  [zoneTypes.CUSTOM]: 'Zone personnalisée',
  [zoneTypes.REGION]: 'Région',
}

export const zoneTypeColors = {
  [zoneTypes.COUNTRY]: '#1e3a8a',
  [zoneTypes.CITY_COMMUNITY]: '#4338ca',
  [zoneTypes.CITY]: '#134e4a',
  [zoneTypes.CANTON]: '#713f12',
  [zoneTypes.DEPARTMENT]: '#c026d3',
  [zoneTypes.DISTRICT]: '#1c1917',
  [zoneTypes.BOROUGH]: '#831843',
  [zoneTypes.FOREIGN_DISTRICT]: '#14532d',
  [zoneTypes.VOTE_PLACE]: '#ea580c',
  [zoneTypes.CUSTOM]: '#3b82f6',
}
