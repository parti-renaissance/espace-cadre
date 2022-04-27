import PropTypes from 'prop-types'

export class GeoRatio {
  constructor(campaignsCount, openRate, clickRate, unsubscribeRate) {
    this.campaignsCount = campaignsCount
    this.openRate = openRate
    this.clickRate = clickRate
    this.unsubscribeRate = unsubscribeRate
  }
}

GeoRatio.propTypes = PropTypes.shape({
  campaignsCount: PropTypes.number,
  openRate: PropTypes.number,
  clickRate: PropTypes.number,
  unsubscribeRate: PropTypes.number,
})

export default class ReportRatio {
  constructor(local, national, since) {
    this.local = local
    this.national = national
    this.since = since
  }
}
ReportRatio.propTypes = PropTypes.shape({
  local: GeoRatio.propTypes.isRequired,
  national: GeoRatio.propTypes.isRequired,
  since: PropTypes.object.isRequired,
})
