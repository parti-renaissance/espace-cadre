import PropTypes from 'prop-types'
import { KPIs, KPICard } from '~/ui/Kpi/KPIs'
import pluralize from '../../shared/pluralize/pluralize'

const messages = {
  visitedPrefix: 'Adresse',
  visitedSuffix: 'terminée',
  toVisit: 'à visiter',
  surveys: 'Questionnaire',
  door: 'Porte',
  knocked: 'frappée',
  contact: 'contact',
  collected: 'collecté',
}

const CampaignDetailKPI = ({ surveys, doors, contacts, addresses }) => (
  <KPIs>
    <KPICard
      main={addresses.completedAddresses || 0}
      title={
        <>
          {pluralize(addresses.completedAddresses, messages.visitedPrefix)}&nbsp;
          {pluralize(addresses.completedAddresses, messages.visitedSuffix)}
        </>
      }
    />
    <KPICard
      main={addresses.todoAddresses || 0}
      title={
        <>
          {pluralize(addresses.todoAddresses, messages.visitedPrefix)}&nbsp;
          {messages.toVisit}
        </>
      }
    />
    <KPICard
      main={doors.knockedCount || 0}
      title={
        <>
          {pluralize(doors.knockedCount, messages.door)}&nbsp;
          {pluralize(doors.knockedCount, messages.knocked)}
        </>
      }
    />
    <KPICard main={surveys.count || 0} title={<>{pluralize(surveys.count, messages.surveys)}</>} />
    <KPICard
      main={contacts.collectedCount || 0}
      title={
        <>
          {pluralize(contacts.collectedCount, messages.contact)}&nbsp;
          {pluralize(contacts.collectedCount, messages.collected)}
        </>
      }
    />
  </KPIs>
)

export default CampaignDetailKPI

CampaignDetailKPI.propTypes = {
  surveys: PropTypes.object,
  doors: PropTypes.object,
  contacts: PropTypes.object,
  addresses: PropTypes.object,
}
