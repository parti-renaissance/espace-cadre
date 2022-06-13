import PropTypes from 'prop-types'

export class PhoningCampaignItemTeam {
  constructor(name, membersCount) {
    this.name = name
    this.membersCount = membersCount
  }
  static propTypes = {
    name: PropTypes.string.isRequired,
    membersCount: PropTypes.number.isRequired,
  }
}

export class PhoningCampaignItemScore {
  constructor(count, globalGoal) {
    this.count = count
    this.globalGoal = globalGoal
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
    globalGoal: PropTypes.number.isRequired,
  }
}

export class PhoningCampaignItem {
  constructor(id, endDate, title, author, team, score, numberOfCalls, numberOfUsersCalled, numberOfUsersToBeCalled) {
    this.id = id
    this.endDate = endDate
    this.title = title
    this.author = author
    this.team = team
    this.score = score
    this.numberOfCalls = numberOfCalls
    this.numberOfUsersCalled = numberOfUsersCalled
    this.numberOfUsersToBeCalled = numberOfUsersToBeCalled
  }
  static propTypes = {
    id: PropTypes.string,
    endDate: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    team: PropTypes.shape(PhoningCampaignItemTeam.propTypes),
    score: PropTypes.shape(PhoningCampaignItemScore.propTypes),
    numberOfCalls: PropTypes.number,
    numberOfUsersCalled: PropTypes.number,
    numberOfUsersToBeCalled: PropTypes.number,
  }
}
