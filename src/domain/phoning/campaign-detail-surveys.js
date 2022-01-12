import PropTypes from 'prop-types'

import { PhoningCampaignDetailHistoryAdherent } from '.'

export class PhoningCampaignDetailSurveysReplyAnswer {
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

export class PhoningCampaignDetailSurveysReply {
  constructor(answers, adherent, startDate, endDate) {
    this.answers = answers
    this.adherent = adherent
    this.startDate = startDate
    this.endDate = endDate
  }
  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.shape(PhoningCampaignDetailSurveysReplyAnswer.propTypes)).isRequired,
    adherent: PropTypes.shape(PhoningCampaignDetailHistoryAdherent.propTypes),
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
  }
}
