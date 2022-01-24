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

export class SurveyItem {
  constructor(id, isPublished, title, author, questionsCount, answersCount) {
    this.id = id
    this.isPublished = isPublished
    this.title = title
    this.author = author
    this.questionsCount = questionsCount
    this.answersCount = answersCount
  }
  static propTypes = {
    id: PropTypes.string,
    isPublished: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.shape(SurveyItemAuthor.propTypes),
    questionsCount: PropTypes.number.isRequired,
    answersCount: PropTypes.number.isRequired,
  }
}
