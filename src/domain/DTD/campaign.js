import PropTypes from 'prop-types'

export class DTDCampaign {
  constructor(id, title, startDate, endDate, calls, surveys, averageTime, goal, brief, team, survey, filters) {
    this.id = id
    this.title = title
    this.startDate = startDate
    this.endDate = endDate
    this.calls = calls
    this.surveys = surveys
    this.averageTime = averageTime
    this.goal = goal
    this.brief = brief
    this.team = team
    this.survey = survey
    this.filters = filters
  }
}
export class DTDCampaignFilters {
  constructor(
    firstName,
    lastName,
    gender,
    adherentFromDate,
    adherentToDate,
    ageMin,
    ageMax,
    certified,
    committeeMember,
    emailSubscribed,
    SMSSubscribed,
    zones
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.adherentFromDate = adherentFromDate
    this.adherentToDate = adherentToDate
    this.ageMin = ageMin
    this.ageMax = ageMax
    this.certified = certified
    this.committeeMember = committeeMember
    this.emailSubscribed = emailSubscribed
    this.SMSSubscribed = SMSSubscribed
    this.zones = zones
  }
}
export class DTDCampaignReply {
  constructor(answers, firstName, lastName, startDate, endDate) {
    this.answers = answers
    this.firstName = firstName
    this.lastName = lastName
    this.startDate = startDate
    this.endDate = endDate
  }
}
export class DTDCampaignReplyAnswer {
  constructor(type, answer, question) {
    this.type = type
    this.answer = answer
    this.question = question
  }
}
export class DTDCampaignZone {
  constructor(id, name, code) {
    this.id = id
    this.name = name
    this.code = code
  }
}
export class DTDCampaignTeam {
  constructor(id, name, author) {
    this.id = id
    this.name = name
    this.author = author
  }
}
export class DTDCampaignSurvey {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}
export class DTDCampaignCalls {
  constructor(count, toRemind) {
    this.count = count
    this.toRemind = toRemind
  }
}

export class DTDCampaignSurveys {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
}

DTDCampaign.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired,
  calls: PropTypes.shape(DTDCampaignCalls.propTypes),
  surveys: PropTypes.shape(DTDCampaignSurveys.propTypes),
  averageTime: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  brief: PropTypes.string.isRequired,
  team: PropTypes.shape(DTDCampaignTeam.propTypes),
  survey: PropTypes.shape(DTDCampaignSurvey.propTypes),
  filters: PropTypes.shape(DTDCampaignFilters.propTypes),
})

DTDCampaignFilters.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  adherentFromDate: PropTypes.string.isRequired,
  adherentToDate: PropTypes.string.isRequired,
  ageMin: PropTypes.number.isRequired,
  ageMax: PropTypes.number.isRequired,
  certified: PropTypes.bool.isRequired,
  committeeMember: PropTypes.bool.isRequired,
  emailSubscribed: PropTypes.bool.isRequired,
  SMSSubscribed: PropTypes.bool.isRequired,
  zones: PropTypes.arrayOf(DTDCampaignZone.propTypes).isRequired,
}

DTDCampaignReplyAnswer.propTypes = {
  type: PropTypes.string.isRequired,
  answer: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.string.isRequired]),
  question: PropTypes.string.isRequired,
}

DTDCampaignReply.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape(DTDCampaignReplyAnswer.propTypes)).isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired,
}

DTDCampaignZone.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
}

DTDCampaignTeam.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string,
}

DTDCampaignSurvey.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

DTDCampaignCalls.propTypes = {
  count: PropTypes.number.isRequired,
  toRemind: PropTypes.number.isRequired,
}

DTDCampaignSurveys.propTypes = {
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
}
