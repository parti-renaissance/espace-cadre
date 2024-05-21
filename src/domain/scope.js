import PropTypes from 'prop-types'
import scopes, { isZonedScope, nationalScopes } from '~/shared/scopes'

export class Scope {
  constructor({ code, name, zones, features, attributes, delegated_access }) {
    this.code = code
    this.name = name
    this.zones = zones
    this.features = features
    this.attributes = attributes
    this.delegatedAccess = delegated_access
  }

  getZoneName() {
    const code = this.getMainCode()
    if (!isZonedScope(code)) {
      return ''
    }

    return this.zones[0]?.name
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

  hasFeature(feature) {
    return this.features.includes(feature)
  }

  isAnimator() {
    return this.getMainCode() === scopes.animator
  }

  isNational() {
    return nationalScopes.includes(this.getMainCode())
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
