import PropTypes from 'prop-types'

export class DTDCampaignDetailHistoryAddress {
  constructor(number, street, postCode, city, block, floor, door) {
    this.number = number
    this.street = street
    this.postCode = postCode
    this.city = city
    this.block = block
    this.floor = floor
    this.door = door
  }
  static propTypes = {
    number: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    postCode: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    block: PropTypes.string.isRequired,
    door: PropTypes.string.isRequired,
  }
}

export class DTDCampaignDetailHistoryQuestioner {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }
}

export class DTDCampaignDetailHistory {
  constructor(id, status, address, questioner, startDate, duration) {
    this.id = id
    this.status = status
    this.address = address
    this.questioner = questioner
    this.startDate = startDate
    this.duration = duration
  }
  static propTypes = {
    id: PropTypes.string,
    status: PropTypes.string.isRequired,
    address: PropTypes.shape(DTDCampaignDetailHistoryAddress.propTypes),
    questioner: PropTypes.shape(DTDCampaignDetailHistoryQuestioner.propTypes),
    startDate: PropTypes.object.isRequired,
    duration: PropTypes.number.isRequired,
  }
}
