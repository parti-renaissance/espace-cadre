import PropTypes from 'prop-types'
import { UIChip } from 'ui/Card'
import { electionStatus } from 'components/Committees/constants'

const values = {
  [electionStatus.not_started]: 'A venir',
  [electionStatus.scheduled]: 'Planifiée',
  [electionStatus.in_progress]: 'En cours',
  [electionStatus.closed]: 'Terminée',
  [electionStatus.canceled]: 'Annulée',
}

const Status = ({ status }) => <UIChip label={values[status] || status} color="teal700" bgcolor="activeLabel" />

export default Status

Status.propTypes = {
  status: PropTypes.string,
}
