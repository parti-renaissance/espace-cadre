import PropTypes from 'prop-types'

export class SurveyDetail {
  constructor(id, title) {
    this.id = id
    this.title = title
  }
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
  }
}
