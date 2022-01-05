import PropTypes from 'prop-types'

export class PhoningCampaign {
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
export class PhoningCampaignFilters {
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
export class PhoningCampaignReply {
  constructor(answers, firstName, lastName, startDate, endDate) {
    this.answers = answers
    this.firstName = firstName
    this.lastName = lastName
    this.startDate = startDate
    this.endDate = endDate
  }
}
export class PhoningCampaignReplyAnswer {
  constructor(type, answer, question) {
    this.type = type
    this.answer = answer
    this.question = question
  }
}
export class PhoningCampaignZone {
  constructor(id, name, code) {
    this.id = id
    this.name = name
    this.code = code
  }
}
export class PhoningCampaignTeam {
  constructor(id, name, author) {
    this.id = id
    this.name = name
    this.author = author
  }
}
export class PhoningCampaignSurvey {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
}
export class PhoningCampaignCalls {
  constructor(count, toRemind) {
    this.count = count
    this.toRemind = toRemind
  }
}

export class PhoningCampaignSurveys {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
}

PhoningCampaign.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired,
  calls: PropTypes.shape(PhoningCampaignCalls.propTypes),
  surveys: PropTypes.shape(PhoningCampaignSurveys.propTypes),
  averageTime: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  brief: PropTypes.string.isRequired,
  team: PropTypes.shape(PhoningCampaignTeam.propTypes),
  survey: PropTypes.shape(PhoningCampaignSurvey.propTypes),
  filters: PropTypes.shape(PhoningCampaignFilters.propTypes),
})

PhoningCampaignFilters.propTypes = {
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
  zones: PropTypes.arrayOf(PhoningCampaignZone.propTypes).isRequired,
}

PhoningCampaignReplyAnswer.propTypes = {
  type: PropTypes.string.isRequired,
  answer: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.string.isRequired]),
  question: PropTypes.string.isRequired,
}

PhoningCampaignReply.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape(PhoningCampaignReplyAnswer.propTypes)).isRequired,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired,
}

PhoningCampaignZone.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
}

PhoningCampaignTeam.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string,
}

PhoningCampaignSurvey.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

PhoningCampaignCalls.propTypes = {
  count: PropTypes.number.isRequired,
  toRemind: PropTypes.number.isRequired,
}

PhoningCampaignSurveys.propTypes = {
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
}
