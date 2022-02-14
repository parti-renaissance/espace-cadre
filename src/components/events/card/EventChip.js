import { isAfter } from 'date-fns'
import { UIChip } from 'ui/Card'
import PropTypes from 'prop-types'

const today = new Date()

const EventChip = ({ event, messages }) => {
  if (!event?.scheduled) return <UIChip color="red600" bgcolor="inactiveLabel" label={messages.canceled} />
  if (isAfter(today, event?.beginAt)) return <UIChip color="gray700" bgcolor="pastLabel" label={messages.past} />
  return <UIChip color="teal700" bgcolor="activeLabel" label={messages.scheduled} />
}

export default EventChip

EventChip.propTypes = {
  event: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
}
