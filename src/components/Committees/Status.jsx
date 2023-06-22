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

const Status = ({ status, ...props }) => {
  let defaultProperties = {
    label: typeof values[status] !== 'undefined' ? values[status] : 'Statut inconnu',
    color: 'colors.gray.800',
    bgcolor: 'colors.gray.100',
  }
  let properties = defaultProperties

  if (electionStatus.canceled === status) {
    properties = Object.assign(defaultProperties, {
      label: values[status],
      color: 'red600',
      bgcolor: 'inactiveLabel',
    })
  }

  if (electionStatus.closed === status) {
    properties = Object.assign(defaultProperties, {
      label: values[status],
      color: 'teal700',
      bgcolor: 'activeLabel',
    })
  }

  if ([electionStatus.scheduled, electionStatus.in_progress].includes(status)) {
    properties = Object.assign(defaultProperties, {
      label: values[status],
      color: 'yellow800',
      bgcolor: 'pendingLabel',
    })
  }

  return <UIChip {...properties} {...props} />
}

export default Status

Status.propTypes = {
  status: PropTypes.string,
}
