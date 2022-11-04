import PropTypes from 'prop-types'
import { Zone } from '../zone'

export class PhoningCampaignCreateEditGlobal {
  constructor(title, goal, endDate, brief, visibility, zone) {
    this.title = title
    this.goal = goal
    this.endDate = endDate
    this.brief = brief
    this.visibility = visibility
    this.zone = zone
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    goal: PropTypes.number.isRequired,
    endDate: PropTypes.object.isRequired,
    brief: PropTypes.string.isRequired,
    visibility: PropTypes.string.isRequired,
    zone: PropTypes.shape(Zone.propTypes),
  }
}

export class PhoningCampaignCreateEditTeam {
  constructor(id, name, membersCount) {
    this.id = id
    this.name = name
    this.membersCount = membersCount
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    membersCount: PropTypes.number.isRequired,
  }
}

export class PhoningCampaignCreateEditSurvey {
  constructor(id, name) {
    this.id = id
    this.name = name
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }
}

export class PhoningCampaignCreateEditZone {
  constructor(id, name, code) {
    this.id = id
    this.name = name
    this.code = code
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  }
}

export class PhoningCampaignCreateEditFilters {
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
    renaissanceMembership,
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
    this.renaissanceMembership = renaissanceMembership
    this.zones = zones
  }
  static propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    gender: PropTypes.string,
    adherentFromDate: PropTypes.string,
    adherentToDate: PropTypes.string,
    ageMin: PropTypes.number,
    ageMax: PropTypes.number,
    certified: PropTypes.bool,
    committeeMember: PropTypes.bool,
    emailSubscribed: PropTypes.bool,
    SMSSubscribed: PropTypes.bool,
    renaissanceMembership: PropTypes.string,
    zones: PropTypes.arrayOf(PropTypes.shape(PhoningCampaignCreateEditZone.propTypes)).isRequired,
  }
}

export class PhoningCampaignCreateEdit {
  constructor(global, team, survey, filters) {
    this.global = global
    this.team = team
    this.survey = survey
    this.filters = filters
  }
  static propTypes = {
    global: PropTypes.shape(PhoningCampaignCreateEditGlobal.propTypes),
    team: PropTypes.shape(PhoningCampaignCreateEditTeam.propTypes),
    survey: PropTypes.shape(PhoningCampaignCreateEditSurvey.propTypes),
    filters: PropTypes.shape(PhoningCampaignCreateEditFilters.propTypes),
  }
}
