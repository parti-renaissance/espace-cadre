import PropTypes from 'prop-types'

export class SurveyDetailAuthor {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }
}

export class SurveyDetailChoice {
  constructor(id, content) {
    this.id = id
    this.content = content
  }
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string.isRequired,
  }
}

export class SurveyDetailQuestion {
  constructor(id, type, content, choices) {
    this.id = id
    this.type = type
    this.content = content
    this.choices = choices
  }
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    choices: PropTypes.arrayOf(PropTypes.shape(SurveyDetailChoice.propTypes)).isRequired,
  }
}

export class SurveyDetail {
  constructor(id, isPublished, title, author, questions) {
    this.id = id
    this.isPublished = isPublished
    this.title = title
    this.author = author
    this.questions = questions
  }
  static propTypes = {
    id: PropTypes.string,
    isPublished: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.shape(SurveyDetailAuthor.propTypes),
    questions: PropTypes.arrayOf(PropTypes.shape(SurveyDetailQuestion.propTypes)).isRequired,
  }
}
