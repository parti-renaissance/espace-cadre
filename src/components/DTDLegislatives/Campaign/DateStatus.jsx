import PropTypes from 'prop-types'
import { format, isBefore, differenceInCalendarDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import pluralize from '../../shared/pluralize/pluralize'

const messages = {
  day: 'jour',
  remaining: 'restant',
}
const today = new Date()

const DateStatus = ({ startDate, endDate }) => {
  const remainingDays = differenceInCalendarDays(endDate, new Date()) || 0

  if (isBefore(today, startDate)) {
    return format(startDate, 'dd MMMM yyyy', { locale: fr })
  }
  if (isBefore(today, endDate)) {
    return (
      <>
        {remainingDays}&nbsp;
        {pluralize(remainingDays, messages.day)}&nbsp;
        {pluralize(remainingDays, messages.remaining)}
      </>
    )
  }
  return format(endDate, 'dd MMMM yyyy', { locale: fr })
}

export default DateStatus

DateStatus.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
}
