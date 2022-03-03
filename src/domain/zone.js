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
}
