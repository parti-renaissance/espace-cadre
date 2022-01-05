import PropTypes from 'prop-types'

export class DTDCampaigns {
  constructor(id, endDate, title, author, team, score) {
    this.id = id
    this.endDate = endDate
    this.title = title
    this.author = author
    this.team = team
    this.score = score
  }
}

export class DTDCampaignsTeam {
  constructor(name, membersCount) {
    this.name = name
    this.membersCount = membersCount
  }
}

export class DTDCampaignsScore {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
}

DTDCampaigns.propTypes = {
  id: PropTypes.string.isRequired,
  endDate: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  team: DTDCampaignsTeam.propTypes,
  score: DTDCampaignsScore.propTypes,
}

DTDCampaignsTeam.propTypes = {
  name: PropTypes.string.isRequired,
  membersCount: PropTypes.number.isRequired,
}

DTDCampaignsScore.propTypes = {
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
}
