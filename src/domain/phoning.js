import PropTypes from 'prop-types'

export class PhoningCampaignsKPI {
  constructor(count, ongoing) {
    this.count = count
    this.ongoing = ongoing
  }
}
export class PhoningSurveysKPI {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
}
export class PhoningCallsKPI {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
}
export class PhoningGlobalKPI {
  constructor(campaigns, surveys, calls) {
    this.campaigns = campaigns
    this.surveys = surveys
    this.calls = calls
  }
}
export class PhoningTeam {
  constructor(name, membersCount) {
    this.name = name
    this.membersCount = membersCount
  }
}
export class PhoningScore {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
}
export class PhoningCampaigns {
  constructor(id, endDate, title, author, team, score) {
    this.id = id
    this.endDate = endDate
    this.title = title
    this.author = author
    this.team = team
    this.score = score
  }
}

PhoningCampaignsKPI.propTypes = {
  count: PropTypes.string.isRequired,
  ongoing: PropTypes.string.isRequired,
}

PhoningSurveysKPI.propTypes = {
  count: PropTypes.string.isRequired,
  onAMonth: PropTypes.string.isRequired,
}

PhoningCallsKPI.propTypes = {
  count: PropTypes.string.isRequired,
  onAMonth: PropTypes.string.isRequired,
}

PhoningGlobalKPI.propTypes = {
  campaigns: PhoningCampaignsKPI.propTypes,
  surveys: PhoningSurveysKPI.propTypes,
  calls: PhoningCallsKPI.propTypes,
}

PhoningTeam.propTypes = {
  name: PropTypes.string.isRequired,
  membersCount: PropTypes.number.isRequired,
}

PhoningScore.propTypes = {
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
}

PhoningCampaigns.propTypes = {
  id: PropTypes.string.isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  team: PhoningTeam.propTypes,
  score: PhoningScore.propTypes,
}
