import PropTypes from 'prop-types'
import scopes, { isZonedScope } from 'shared/scopes'

export class Scope {
  constructor({ code, name, zones, features, attributes, delegated_access }) {
    this.code = code
    this.name = name
    this.zones = zones
    this.features = features
    this.attributes = attributes
    this.delegatedAccess = delegated_access
  }

  getName() {
    const nameParts = [this.name]

    if (isZonedScope(this.code)) {
      nameParts.push(`(${this.zones[0]?.code})`)
    } else if (this.code === scopes.animator) {
      nameParts.push(`(${this.attributes?.committees?.map(committee => committee.name).join(', ')})`)
    }

    return nameParts.join(' ')
  }

  hasFeature(feature) {
    return this.features.includes(feature)
  }
}

Scope.propTypes = PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  zones: PropTypes.arrayOf(Object).isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  attributes: PropTypes.object,
  delegated_access: PropTypes.object,
})
