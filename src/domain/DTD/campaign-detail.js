import PropTypes from 'prop-types'
import { DTDCampaignDetailKPI } from './campaign-detail-KPI'

export class DTDCampaignDetail {
  constructor(id, title, goal, KPI) {
    this.id = id
    this.title = title
    this.goal = goal
    this.KPI = KPI
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    goal: PropTypes.number.isRequired,
    KPI: PropTypes.shape(DTDCampaignDetailKPI.propTypes),
  }
}
