import PropTypes from 'prop-types'
import { parseDate } from '~/shared/helpers'

export class Document {
  constructor(id, title, description, date, visibility, zone, filePath) {
    this.id = id
    this.title = title
    this.description = description
    this.date = parseDate(date)
    this.visibility = visibility
    this.zone = zone?.uuid
    this.filePath = filePath
  }

  static NULL = new Document(null, '', '', new Date(), 'local', null, null)
}

Document.propTypes = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.object,
  visibility: PropTypes.string,
  zone: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  filePath: PropTypes.string,
})
