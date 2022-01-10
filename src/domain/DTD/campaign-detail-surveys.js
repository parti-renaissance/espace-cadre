import PropTypes from 'prop-types'

import { DTDCampaignDetailHistoryQuestioner } from '.'
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
  constructor(answers, questioner, duration, startDate) {
    this.answers = answers
    this.questioner = questioner
    this.duration = duration
    this.startDate = startDate
  }
  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.shape(DTDCampaignDetailSurveysReplyAnswer.propTypes)).isRequired,
    questioner: PropTypes.shape(DTDCampaignDetailHistoryQuestioner.propTypes),
    duration: PropTypes.number.isRequired,
    startDate: PropTypes.object.isRequired,
  }
}
