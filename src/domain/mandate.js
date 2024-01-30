import PropTypes from 'prop-types'
import { parseDate } from '~/shared/helpers'

export class Mandate {
  constructor({ uuid, mandateType, zone, beginAt = null, finishAt = null, delegation = '' }) {
    this.uuid = uuid
    this.mandateType = mandateType
    this.zone = zone
    this.beginAt = beginAt
    this.finishAt = finishAt
    this.onGoing = !finishAt
    this.delegation = delegation
  }

  static NULL = new Mandate({})

  static fromApi = m =>
    new Mandate({
      uuid: m.uuid,
      mandateType: m.mandate_type,
      zone: m.zone,
      beginAt: m.begin_at ? parseDate(m.begin_at) : null,
      finishAt: m.finish_at ? parseDate(m.finish_at) : null,
      delegation: m.delegation,
    })
}

Mandate.propTypes = PropTypes.shape({
  uuid: PropTypes.string,
  mandateType: PropTypes.string,
  zone: PropTypes.object,
  beginAt: PropTypes.objectOf(Date),
  finishAt: PropTypes.objectOf(Date),
  delegation: PropTypes.string,
})
