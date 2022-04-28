import PropTypes from 'prop-types'

import { DTDCampaignDetailHistoryQuestioner } from '.'

export class DTDCampaignDetailSurveysAddress {
  constructor(address, city_name, insee_code, building_type, status, nb_visited_doors, questioner) {
    this.address = address
    this.cityName = city_name
    this.inseeCode = insee_code
    this.buildingType = building_type
    this.status = status
    this.numberVisitedDoors = nb_visited_doors
    this.questioner = questioner
  }
  static propTypes = {
    address: PropTypes.string.isRequired,
    cityName: PropTypes.string.isRequired,
    inseeCode: PropTypes.string.isRequired,
    buildingType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    numberVisitedDoors: PropTypes.string.isRequired,
    questioner: PropTypes.shape(DTDCampaignDetailHistoryQuestioner.propTypes),
  }
}
