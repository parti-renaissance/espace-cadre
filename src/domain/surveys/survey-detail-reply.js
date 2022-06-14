import PropTypes from 'prop-types'

export class SurveyDetailReplyAuthor {
  constructor(firstName, lastName, gender, age) {
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.age = age
  }
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    gender: PropTypes.string,
    age: PropTypes.number,
  }
}

export class SurveyDetailReplyAnswer {
  constructor(type, answer, question, questionId) {
    this.type = type
    this.answer = answer
    this.question = question
    this.questionId = questionId
  }
  static propTypes = {
    type: PropTypes.string.isRequired,
    answer: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.string.isRequired]),
    question: PropTypes.string.isRequired,
    questionId: PropTypes.number.isRequired,
  }
}

export class SurveyDetailReply {
  constructor(answers, author, startDate, endDate) {
    this.answers = answers
    this.author = author
    this.startDate = startDate
    this.endDate = endDate
  }
  static propTypes = {
    answers: PropTypes.arrayOf(PropTypes.shape(SurveyDetailReplyAnswer.propTypes)).isRequired,
    author: PropTypes.shape(SurveyDetailReplyAuthor.propTypes),
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
  }
}
