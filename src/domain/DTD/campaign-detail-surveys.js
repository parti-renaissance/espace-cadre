import PropTypes from 'prop-types'

export class DTDCampaignDetailSurveysReplyAnswer {
  constructor(type, answer, question) {
    this.type = type
    this.answer = answer
    this.question = question
  }
  static propTypes = {
    type: PropTypes.string.isRequired,
    answer: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.string.isRequired]),
    question: PropTypes.string.isRequired,
  }
}

export class DTDCampaignDetailSurveysReply {
  constructor(answers, firstName, lastName, duration, startDate) {
    this.answers = answers
    this.firstName = firstName
    this.lastName = lastName
    this.duration = duration
    this.startDate = startDate
  }
  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.shape(DTDCampaignDetailSurveysReplyAnswer.propTypes)).isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    startDate: PropTypes.object.isRequired,
  }
}
