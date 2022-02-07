import { KPICard, KPIs } from 'ui/Kpi/KPIs'
import pluralize from 'components/shared/pluralize/pluralize'
import { differenceInCalendarDays, format } from 'date-fns'
import PropTypes from 'prop-types'

const messages = {
  until: "Jusqu'au",
  participant: 'participant',
  day: 'Jour',
  remaining: 'restant',
}

const KpiEvent = ({ participants, date, isLoading = false }) => {
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
          <KPICard main={participants} title={pluralize(participants, messages.participant)} />
        </>
      )}
    </KPIs>
  )
}

KpiEvent.propTypes = {
  participants: PropTypes.number,
  date: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
}

export default KpiEvent
