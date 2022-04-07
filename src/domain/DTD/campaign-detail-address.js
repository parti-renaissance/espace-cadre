import PropTypes from 'prop-types'

import { DTDCampaignDetailHistoryQuestioner } from '.'

export class DTDCampaignDetailSurveysAddress {
  constructor(address, buildingType, status, doorsKnocked, questioner) {
    this.address = address
    this.buildingType = buildingType
    this.status = status
    this.doorsKnocked = doorsKnocked
    this.questioner = questioner
  }
  static propTypes = {
    address: PropTypes.string.isRequired,
    buildingType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    doorsKnocked: PropTypes.string.isRequired,
    questioner: PropTypes.shape(DTDCampaignDetailHistoryQuestioner.propTypes),
  }
}
