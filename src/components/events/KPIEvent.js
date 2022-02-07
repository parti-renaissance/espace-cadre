import { KPICard, KPIs } from 'ui/Kpi/KPIs'
import pluralize from 'components/shared/pluralize/pluralize'
import { differenceInCalendarDays, format } from 'date-fns'
import PropTypes from 'prop-types'

const messages = {
  until: "Jusqu'au",
  attendee: 'participant',
  day: 'Jour',
  remaining: 'restant',
}

const KpiEvent = ({ attendees, date, isLoading = false }) => {
  const daysRemaining = differenceInCalendarDays(date, new Date()) || 0

  return (
    <KPIs isLoading={isLoading}>
      {date && (
        <>
          <KPICard
            main={daysRemaining <= 0 ? 0 : daysRemaining}
            title={`${pluralize(daysRemaining, messages.day)} ${pluralize(daysRemaining, messages.remaining)}`}
            subtitle={`${messages.until} ${format(date, 'dd/MM/yyyy')}`}
          />
          <KPICard main={attendees} title={pluralize(attendees, messages.attendee)} />
        </>
      )}
    </KPIs>
  )
}

KpiEvent.propTypes = {
  attendees: PropTypes.number,
  date: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
}

export default KpiEvent
