import PropTypes from 'prop-types'
import { isBefore, differenceInCalendarDays } from 'date-fns'
import pluralize from '../../shared/pluralize/pluralize'
import { formatDate } from '~/shared/helpers'

const messages = {
  day: 'jour',
  remaining: 'restant',
}
const today = new Date()

const DateStatus = ({ startDate, endDate }) => {
  const remainingDays = differenceInCalendarDays(endDate, new Date()) || 0

  if (isBefore(today, startDate)) {
    return formatDate(startDate, 'dd MMMM yyyy')
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
  return formatDate(endDate, 'dd MMMM yyyy')
}

export default DateStatus

DateStatus.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
}
