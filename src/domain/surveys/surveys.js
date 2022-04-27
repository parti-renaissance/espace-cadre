import PropTypes from 'prop-types'

export class SurveyItemAuthor {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }
}
export class SurveyItemZone {
  constructor(id, code, name) {
    this.id = id
    this.code = code
    this.name = name
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }
}
export class SurveyItem {
  constructor(id, isPublished, title, author, questionsCount, answersCount, type, zone) {
    this.id = id
    this.isPublished = isPublished
    this.title = title
    this.author = author
    this.questionsCount = questionsCount
    this.answersCount = answersCount
    this.type = type
    this.zone = zone
  }
  static propTypes = {
    id: PropTypes.string,
    isPublished: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.shape(SurveyItemAuthor.propTypes),
    questionsCount: PropTypes.number.isRequired,
    answersCount: PropTypes.number.isRequired,
    type: PropTypes.string,
    zone: PropTypes.shape(SurveyItemZone.propTypes),
  }
}

export class SurveyKPIs {
  constructor(localSurveysCount, localPublishedSurveysCount, nationalSurveysCount, nationalPublishedSurveysCount) {
    this.localSurveysCount = localSurveysCount
    this.localPublishedSurveysCount = localPublishedSurveysCount
    this.nationalSurveysCount = nationalSurveysCount
    this.nationalPublishedSurveysCount = nationalPublishedSurveysCount
  }

  static propTypes = {
    localSurveysCount: PropTypes.number.isRequired,
    localPublishedSurveysCount: PropTypes.number.isRequired,
    nationalSurveysCount: PropTypes.number.isRequired,
    nationalPublishedSurveysCount: PropTypes.number.isRequired,
  }
}
