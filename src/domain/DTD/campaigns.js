import PropTypes from 'prop-types'

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

export class PhoningCampaignsTeam {
  constructor(name, membersCount) {
    this.name = name
    this.membersCount = membersCount
  }
}

export class PhoningCampaignsScore {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
}

PhoningCampaigns.propTypes = {
  id: PropTypes.string.isRequired,
  endDate: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  team: PhoningCampaignsTeam.propTypes,
  score: PhoningCampaignsScore.propTypes,
}

PhoningCampaignsTeam.propTypes = {
  name: PropTypes.string.isRequired,
  membersCount: PropTypes.number.isRequired,
}

PhoningCampaignsScore.propTypes = {
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
}
