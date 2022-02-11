import { KPICard, KPIs } from 'ui/Kpi/KPIs'
import pluralize from 'components/shared/pluralize/pluralize'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import PropTypes from 'prop-types'

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
        <KPICard main={format(date, 'dd', { locale: fr })} title={format(date, 'MMMM yyyy', { locale: fr })} />
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
