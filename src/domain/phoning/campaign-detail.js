import PropTypes from 'prop-types'

import { PhoningCampaignCreateEdit, PhoningCampaignDetailKPI } from '.'

export class PhoningCampaignDetail {
  constructor(id, title, goal, KPI, createEdit) {
    this.id = id
    this.title = title
    this.goal = goal
    this.KPI = KPI
    this.createEdit = createEdit
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    goal: PropTypes.number.isRequired,
    KPI: PropTypes.shape(PhoningCampaignDetailKPI.propTypes),
    createEdit: PropTypes.shape(PhoningCampaignCreateEdit.propTypes),
  }
}
