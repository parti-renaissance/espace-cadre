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

  getMainCode() {
    return this.delegatedAccess ? this.delegatedAccess.type : this.code
  }

  getName() {
    const nameParts = [this.name]
    const code = this.getMainCode()

    if (isZonedScope(code)) {
      nameParts.push(`(${this.zones[0]?.code})`)
    } else if (this.isAnimator()) {
      nameParts.push(
        `(${this.getCommittees()
          ?.map(committee => committee.name)
          .join(', ')})`
      )
    }

    return nameParts.join(' ')
  }

  getAttributes() {
    return this.attributes
  }

  getCommittees() {
    return this.getAttributes()?.committees
  }

  canUpdateEvent() {
    return [scopes.deputy, scopes.senator, scopes.president_departmental_assembly].includes(this.getMainCode())
  }

  hasFeature(feature) {
    return this.features.includes(feature)
  }

  isAnimator() {
    return this.getMainCode() === scopes.animator
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
