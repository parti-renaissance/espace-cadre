import PropTypes from 'prop-types'
import { KPIs, KPICard } from 'ui/Kpi/KPIs'
import pluralize from '../../shared/pluralize/pluralize'

const messages = {
  visitedPrefix: 'Adresse',
  visitedSuffix: 'visitée',
  toVisit: 'à visiter',
  surveys: 'Questionnaire',
  door: 'Porte',
  knocked: 'frappée',
  contact: 'contact',
  collected: 'collecté',
}

const CampaignDetailKPI = ({ campaign }) => (
  <KPIs>
    <KPICard
      main={campaign?.visitedAddresses || 0}
      title={
        <>
          {pluralize(campaign?.visitedAddresses, messages.visitedPrefix)}&nbsp;
          {pluralize(campaign?.visitedAddresses, messages.visitedSuffix)}
        </>
      }
    />
    <KPICard
      main={campaign?.toVisitAddresses || 0}
      title={
        <>
          {pluralize(campaign?.toVisitAddresses, messages.visitedPrefix)}&nbsp;
          {messages.toVisit}
        </>
      }
    />
    <KPICard
      main={campaign?.KPI?.doors?.knockedCount || 0}
      title={
        <>
          {pluralize(campaign?.KPI?.doors?.knockedCount, messages.door)}&nbsp;
          {pluralize(campaign?.KPI?.doors?.knockedCount, messages.knocked)}
        </>
      }
    />
    <KPICard
      main={campaign?.KPI?.surveys?.count || 0}
      title={<>{pluralize(campaign?.KPI?.surveys?.count, messages.surveys)}</>}
    />
    <KPICard
      main={campaign?.KPI?.contacts?.collectedCount || 0}
      title={
        <>
          {pluralize(campaign?.KPI?.contacts?.collectedCount, messages.contact)}&nbsp;
          {pluralize(campaign?.KPI?.contacts?.collectedCount, messages.collected)}
        </>
      }
    />
  </KPIs>
)

export default CampaignDetailKPI

CampaignDetailKPI.propTypes = {
  campaign: PropTypes.object,
}
