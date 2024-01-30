import { isAfter } from 'date-fns'
import { UIChip } from '~/ui/Card'
import { Event } from '~/domain/event'

const messages = {
  scheduled: 'À venir',
  canceled: 'Annulé',
  past: 'Passé',
}

const today = new Date()

const EventChip = ({ event }) => {
  if (!event?.scheduled) {
    return <UIChip color="red600" bgcolor="inactiveLabel" label={messages.canceled} />
  }
  if (isAfter(today, event?.beginAt)) {
    return <UIChip color="gray700" bgcolor="pastLabel" label={messages.past} />
  }
  return <UIChip color="teal700" bgcolor="activeLabel" label={messages.scheduled} />
}

export default EventChip

EventChip.propTypes = {
  event: Event.propTypes.isRequired,
}
