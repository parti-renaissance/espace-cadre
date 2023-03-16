import PropTypes from 'prop-types'
import { UIChip } from 'ui/Card'

const values = {
  not_started: 'Non commencée',
  scheduled: 'Planifiée',
  in_progress: 'En cours',
  closed: 'Terminée',
}

const Status = ({ status }) => <UIChip label={values[status]} color="teal700" bgcolor="activeLabel" />

export default Status

Status.propTypes = {
  status: PropTypes.string,
}
