import PropTypes from 'prop-types'

export class DTDCampaign {
  constructor(id, title, goal, startDate, endDate, survey, brief, votePlaces) {
    this.id = id
    this.title = title
    this.goal = goal
    this.startDate = startDate
    this.endDate = endDate
    this.survey = survey
    this.brief = brief
    this.votePlaces = votePlaces
  }

  static NULL = new DTDCampaign(0, '', '', null, null, '', '', [])

  withId(newId) {
    return new DTDCampaign(
      newId,
      this.title,
      this.goal,
      this.startDate,
      this.endDate,
      this.survey,
      this.brief,
      this.votePlaces
    )
  }

  withTitle(newTitle) {
    return new DTDCampaign(
      this.id,
      newTitle,
      this.goal,
      this.startDate,
      this.endDate,
      this.survey,
      this.brief,
      this.votePlaces
    )
  }

  withGoal(newGoal) {
    return new DTDCampaign(
      this.id,
      this.title,
      newGoal,
      this.startDate,
      this.endDate,
      this.survey,
      this.brief,
      this.votePlaces
    )
  }

  withStartDate(newStartDate) {
    return new DTDCampaign(
      this.id,
      this.title,
      this.goal,
      newStartDate,
      this.endDate,
      this.survey,
      this.brief,
      this.votePlaces
    )
  }

  withEndDate(newEndDate) {
    return new DTDCampaign(
      this.id,
      this.title,
      this.goal,
      this.startDate,
      newEndDate,
      this.survey,
      this.brief,
      this.votePlaces
    )
  }

  withSurvey(newSurvey) {
    return new DTDCampaign(
      this.id,
      this.title,
      this.goal,
      this.startDate,
      this.endDate,
      newSurvey,
      this.brief,
      this.votePlaces
    )
  }

  withBrief(newBrief) {
    return new DTDCampaign(
      this.id,
      this.title,
      this.goal,
      this.startDate,
      this.endDate,
      this.survey,
      newBrief,
      this.votePlaces
    )
  }

  withVotePlaces(newVotePlace) {
    return new DTDCampaign(
      this.id,
      this.title,
      this.goal,
      this.startDate,
      this.endDate,
      this.survey,
      this.brief,
      newVotePlace
    )
  }

  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    goal: PropTypes.number.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    survey: PropTypes.string.isRequired,
    brief: PropTypes.string.isRequired,
    votePlaces: PropTypes.array.isRequired,
  }
}

export class DTDCampaignItemScore {
  constructor(count, goal, knockedDoors, addresses, voters, pollingStations, collectedContacts) {
    this.count = count
    this.goal = goal
    this.knockedDoors = knockedDoors
    this.addresses = addresses
    this.voters = voters
    this.pollingStations = pollingStations
    this.collectedContacts = collectedContacts
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired,
    knockedDoors: PropTypes.number.isRequired,
    addresses: PropTypes.number.isRequired,
    voters: PropTypes.number.isRequired,
    pollingStations: PropTypes.number.isRequired,
    collectedContacts: PropTypes.number.isRequired,
  }
}

export class DTDCampaignItem {
  constructor(id, author, startDate, endDate, title, score) {
    this.id = id
    this.author = author
    this.startDate = startDate
    this.endDate = endDate
    this.title = title
    this.score = score
  }
  static propTypes = {
    id: PropTypes.string,
    author: PropTypes.string.isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    score: PropTypes.shape(DTDCampaignItemScore.propTypes),
  }
}
