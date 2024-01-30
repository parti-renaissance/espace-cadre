import { KPICard, KPIs } from '~/ui/Kpi/KPIs'
import pluralize from '~/components/shared/pluralize/pluralize'
import PropTypes from 'prop-types'
import { formatDate } from '~/shared/helpers'

const messages = {
  until: "Jusqu'au",
  attendee: 'participant',
  day: 'Jour',
  remaining: 'restant',
}

const KpiEvent = ({ attendees, date, isLoading = false }) => (
  <KPIs isLoading={isLoading}>
    {date && (
      <>
        <KPICard main={formatDate(date, 'dd')} title={formatDate(date, 'MMMM yyyy')} />
        <KPICard main={attendees} title={pluralize(attendees, messages.attendee)} />
      </>
    )}
  </KPIs>
)

KpiEvent.propTypes = {
  attendees: PropTypes.number,
  date: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
}

export default KpiEvent
